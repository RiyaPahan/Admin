const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const subcategoryController=require('sub-category/controllers/sub-category.controller');
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname === 'image') {
            callback(null, "./public/uploads/faq")
        }

    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            req.fileValidationError = 'Only support jpeg, jpg or png file types.';
            return cb(null, false, new Error('Only support jpeg, jpg or png file types'));
        }
        cb(null, true);
    }
});


const request_param = multer();

namedRouter.all('/sub-category*', auth.authenticate);

namedRouter.post("sub-category.getall", '/sub-category/getall', async (req, res) => {
    try {
        const success = await subcategoryController.getAll(req, res);
        // console.log(success.data);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});
namedRouter.get("sub-category.list", '/sub-category/list',subcategoryController.list);
namedRouter.get("sub-category.create", '/sub-category/create', subcategoryController.create);
namedRouter.post("sub-category.insert", '/sub-category/insert', uploadFile.any(), subcategoryController.insert);
namedRouter.get("sub-category.edit", "/sub-category/edit/:id", subcategoryController.edit);
namedRouter.post("sub-category.update", '/sub-category/update', uploadFile.any(), subcategoryController.update);
namedRouter.get("sub-category.delete", "/sub-category/delete/:id", subcategoryController.delete);
namedRouter.get("sub-category.statusChange", '/sub-category/status-change/:id', request_param.any(), subcategoryController.statusChange);

module.exports = router; 