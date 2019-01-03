const express = require('express');
const router = express.Router();

router.get('/endtoend/3', (req, res) => {
  console.log('should be hitting');
  // Solution to end2end 3 here
  res.send('hi');
});

module.exports = router;
