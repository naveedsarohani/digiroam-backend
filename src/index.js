
import { app } from "./app.js"
import { dbConnection } from "./config/dbConnection.js"
import { errorMiddleware } from "./middeware/errorMiddleware.js"

import { PORT } from "./config/env.js"

dbConnection()

app.use(errorMiddleware)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

