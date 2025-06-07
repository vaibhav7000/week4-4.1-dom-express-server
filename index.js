const express = require("express");
const cors = require("cors");
const z = require("zod");
const app = express();
const port = 3000;

app.use(cors({
  origin: '*',
  methods:['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json());

// sending the numbers in query-params
app.get("/findsum",function(req, res) {
  let firstNumber = req.query.a;
  let secondNumber = req.query.b;

  // want to be valid numbers in the form of string
  const numberSchema = z.coerce.number(); // will try to convert the given input into number

  let result = numberSchema.safeParse(firstNumber);

  if(!result.success) {
    res.status(411).json({
      msg: "Invalid firstNumber",
      issues: result.error.issues
    })
    return
  }

  firstNumber = result.data;

  

  result = numberSchema.safeParse(secondNumber);

  if(!result.success) {
    res.status(411).json({
      msg: "Invalid second",
      issues: result.error.issues
    })
    return
  }

  secondNumber = result.data;

  res.status(200).send(`${firstNumber + secondNumber}`);

})

app.post("/calculator", function(req, res, next) {
  let { first_number, second_number, operation } = req.body;
  console.log(req.body);
  first_number = parseInt(first_number);
  second_number = parseInt(second_number);

  let result = 0;
  if(operation === "+") {
    result = first_number + second_number;
  } else if(operation === "-") {
    result = first_number - second_number;
  } else if(operation === "*") {
    result = first_number * second_number
  } else {
    result = first_number / second_number
  }

  res.status(200).json({
    result
  })
})



app.use(function(err, req, res, next) {
  console.log(err);
  if(err) {
    res.status(500).json({
      msg: "Internal server error",
    })
    return
  }

  next();
})


app.use(function(req, res) {
  res.status(404).json({
    msg: "Route not found"
  })
})



app.listen(port, function() {
  console.log("server started");
})