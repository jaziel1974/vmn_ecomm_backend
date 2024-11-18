import { getStorage, ref, deleteObject } from "firebase/storage";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const storage = getStorage();

  // Create a reference to the file to delete
  const desertRef = ref(storage, 'images/desert.jpg');

  // Delete the file
  deleteObject(desertRef).then(() => {
    // File deleted successfully
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
}