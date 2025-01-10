import multiparty from 'multiparty';
import { storage } from '@/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import mime from 'mime-types';
import fs from 'fs'
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const form = new multiparty.Form();

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    const links = [];
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFileName = Date.now() + '.' + ext;
        const storageRef = ref(storage, 'files/productimages/' + newFileName);
        const metadata = {
            contentType: mime.lookup(file.path)
        }
        const uploadTask = await uploadBytesResumable(
            storageRef,
            fs.readFileSync(file.path).buffer,
            metadata
        );
        const downloadURL = await getDownloadURL(uploadTask.ref);
        links.push(downloadURL);
    }
    return res.json({links});
}

export const config = {
    api: { 
        bodyParser: {
            sizeLimit: '10mb'
        } 
    }
}