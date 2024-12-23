const {   addIncome,
    fetchIncome,
    deleteIncome,
    addExpnse,
    fetchExpnse,
    deleteExpnse,} = require("../controllers/transactionsControllers")

const router = require("express").Router()


router.post('/add-income' , addIncome)
router.get('/fetch-income/:userId' , fetchIncome)
router.delete('/delete-income/:userId/:incomeId' , deleteIncome)


router.post('/add-expanse' , addExpnse)
router.get('/fetch-expanse/:userId' , fetchExpnse)
router.delete('/delete-expanse/:userId/:expanseId' , deleteExpnse)



module.exports = router