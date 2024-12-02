const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PurchaseHistoryRoutes = require('./routes/auth');
const agentPaymentsRoutes = require('./routes/agentPayments');
const freightRoutes = require('./routes/freightRoutes');
const StockRoutes = require('./routes/stock');
const customerRoutes = require('./routes/customers');
const recoveriesRouter = require('./routes/recoveries');
const expenseRoutes = require('./routes/dubaiPort');
const transactionsRoutes = require('./routes/transactions');
const dailyExpensesRoutes = require('./routes/expenses');
const sendPayment = require('./routes/sendPayment')
const RecievedPayment = require('./routes/recievedPayment')
const commission = require('./routes/commission');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', PurchaseHistoryRoutes);
app.use('/api/purchase-history', PurchaseHistoryRoutes);
app.use('/api/agentPayments', agentPaymentsRoutes);
app.use('/api/freight', freightRoutes);
app.use('/api', StockRoutes)
app.use('/api/customers', customerRoutes);
app.use('/api/recoveries', recoveriesRouter);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/dailyExpenses', dailyExpensesRoutes);
app.use('/api/sendPayment', sendPayment);
app.use('/api/recievedPayment', RecievedPayment);
app.use('/api/commissions', commission);

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/imdadPharma").then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

module.exports = app;
