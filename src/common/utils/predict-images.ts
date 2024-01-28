import { spawn } from 'child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';

const makeDir = async (dirPath: string): Promise<void> => {
  // trash 디렉토리 생성
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
};

const saveImages = async (images: Array<Express.Multer.File>): Promise<void> => {
  let idx = 1;
  // 각 이미지를 trash 폴더에 저장
  for (const image of images) {
    const imageName = `${idx}.png`; // 또는 다른 이미지 식별자를 사용
    idx++;

    const imagePath = `src/classy/trash/${imageName}`;
    writeFileSync(imagePath, image.buffer);
  }
};

const deleteDir = async (dirPath: string): Promise<void> => {
  // trash 디렉토리 삭제
  rmSync(dirPath, { recursive: true });
};

export const predictImages = async (images: Array<Express.Multer.File>): Promise<string[]> => {
  try {
    await makeDir('./src/classy/trash');
    await saveImages(images);

    // predict 함수 실행
    const predictResult = spawn('python3', ['src/classy/predict.py']);

    // 데이터 반환
    const stdoutPromise = new Promise<string>((resolve) => {
      predictResult.stdout.on('data', (data) => {
        const dataString: string = data.toString();
        resolve(dataString);
      });
    });

    const [stdout] = await Promise.all([stdoutPromise]);

    await deleteDir('./src/classy/trash');

    return stdout.split(',');
  } catch (error) {
    throw error('모델이 예측하는 과정에서 오류가 발생했습니다.');
  }
};
