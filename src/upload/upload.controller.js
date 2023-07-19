// eslint-disable-next-line import/prefer-default-export
export const uploadFiles = async (req, res) => {
  console.log(req.file);
  try {
    res.status(200).send({
      message: 'uploaded successfully:',
    });
  } catch (err) {
    res.status(500).send({
      message: 'Unable to upload the file:',
    });
  }
};
