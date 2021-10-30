// controller/trails.js
if (req.file !== undefined) {
    createImageResult = await images.create({
      fileName: req.file.filename,
      filePath: req.file.path,
    });
  }
  
  // ... 중략 ...
  const createTrail = await trails
  .create({
    userId: decoded.userId,
    locationId: createLocation.dataValues.id,
    categoryId: createCategory.dataValues.id || created.dataValues.id,
    imageId: createImageResult !== undefined ? createImageResult.dataValues.id : null,
    title: title,
    review: review,
    adminDistrict: adminDistrict,
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });
  
  // send trails
  res.status(200).json({ trails: createTrail.dataValues })