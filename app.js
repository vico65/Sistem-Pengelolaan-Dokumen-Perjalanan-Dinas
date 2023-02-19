import express from "express"

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('login', {
        title: 'login'
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})