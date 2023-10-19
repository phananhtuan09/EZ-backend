const handleUpdateAvatar = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Upload image success",
    data: null,
    error: null,
  });
};

module.exports = {
  handleUpdateAvatar,
};
