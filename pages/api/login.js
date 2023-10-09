export default function handler(req, res) {
  try {

    const body = JSON.parse(JSON.stringify(req.body))
      //const user = Users.find((user) => user.email === body.email && user.password === parseInt(body.password));
      const user = { id: "111", name: "John Doe", email: "johnDoe@xyz.com", password: 1232, role: "user" };
      if (!user) {
          res.status(404).send({ message: 'User does not exist!' })
          return
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(405).send({ message: `{error.message}` })
      return
  }
};