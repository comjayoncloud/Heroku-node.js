const express = require("express");

const app = express(); // 관습적으로 app

const db = require("./models");

const { Member } = db;

app.use(express.json());

app.get("/api/members", async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({ where: { team } });
    res.send(teamMembers);
  } else {
    // console.log(Member);
    const members = await Member.findAll(); // 모든 row 조회해서 가져옴
    res.send(members);
  }
}); // 콜백 혹은 route handler라고함
// req : 이 객체를 통해서 클라이언트가 보낸 request를 다룰수 있음
// res : 이 객체를 통해서 적절한 리스폰스를 보낼수 있다.

app.get("/api/members/:id", async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "there is no member with the id!!" });
  }
}); // :id는 라우트 파라미터

app.post("/api/members", async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  res.send(member);
});

////## PUT 방법1

// app.put("/api/members/:id", async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } });
//   if (result[0]) {
//     res.send({ message: `${result[0]} row(s) affacted` });
//   } else {
//     res.status(404).send({ message: "there is no memeber with the id!" });
//   }
// });

//// ## PUT 방법2 (ORM)
app.put("api/members/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } }); // 왜가져올까? member는 해당 row와 연동 되있기 때문
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: "there is no member with the id!" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCount = await Member.destroy({ where: { id } });
  if (deleteCount) {
    res.send({ message: `${deleteCount} row(s) deleted` });
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening..");
});
