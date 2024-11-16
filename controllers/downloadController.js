import fetch from 'node-fetch';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath);

export const download = async (req, res) => {
  try {
    const { link, name, contentType } = req.body;

    const response = await fetch(link);
    if (!response.ok) throw new Error('Ошибка при загрузке файла');

    const fileStream = response.body;

    res.setHeader('Content-Disposition', `attachment; filename="${name}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg'); // Указываем тип контента для MP3

    if (contentType?.includes('audio')) {
      ffmpeg(Readable.from(fileStream))
        .inputFormat('ogg')
        .audioQuality(96)
        .toFormat('mp3')
        .on('error', (err) => {
          console.error("Ошибка конвертации файла:", err.message);
          res.status(500).send({ error: "Ошибка при конвертации файла" });
        })
        .on('end', () => {
          console.log('Конвертация завершена!');
        })
        .pipe(res, { end: true });
    } else {
      fileStream.pipe(res);
    }
  } catch (err) {
    console.error("Ошибка при загрузке файла:", err.message);
    res.status(500).send({ error: "Ошибка на сервере при загрузке файла" });
  }
};
