import axios from 'axios';

export const predictImages = async (images: Array<Express.Multer.File>): Promise<string[]> => {
  try {
    const formData = new FormData();

    // 이미지 배열을 FormData에 추가
    images.forEach((image, index) => {
      const blob = new Blob([image.buffer], { type: image.mimetype });
      formData.append('images', blob, image.originalname);
    });

    // TODO: 외부 서버와 연결
    const data = await axios.post('http://34.64.136.104/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const ret: string[] = data.data[0].split(',');

    return ret;
  } catch (error) {
    throw error;
  }
};
