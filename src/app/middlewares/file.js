import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../../../public/uploads');
            fs.mkdir(uploadPath, { recursive: true }, (err) => {
                if (err) {
                    return cb(err, null);
                }
                cb(null, uploadPath);
            });
        },

        filename: function (req, file, cb) {
            crypto.randomBytes(18, (error, buffer) => {
                cb(null, buffer.toString('hex') + path.extname(file.originalname));
            })
        },
    })
});

const save = (fieldsOrField, count = 1) => (req, res, next) => {
    try {
        let middleware;

        if (typeof fieldsOrField === "string") {
            if (count > 1) {
                middleware = upload.array(fieldsOrField, count);
            } else {
                middleware = upload.single(fieldsOrField);
            }
        } else if (Array.isArray(fieldsOrField)) {
            middleware = upload.fields(fieldsOrField.map(({ name, maxCount = 1 }) => ({ name, maxCount })));
        }

        middleware(req, res, (error) => {
            if (error) return res.response(500, `Error uploading file`, { error });

            if (req.file) {
                req.files = [req.file]
            }

            next();
        });
    } catch (error) {
        res.response(500, error.message ?? "Internal server error", { error });
    }
};

const del = (filename) => {
    const filepath = path.join(__dirname, "../../../public/uploads/", filename);
    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (error) => {
            if (error) throw error;
        });
    }
};

// Middleware for Handling Requests Without Files
const none = upload.none();

export default { save, delete: del, none };
