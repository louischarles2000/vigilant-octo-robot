"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Create a write stream (in append mode) for the logs
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
// Use morgan middleware with the write stream
// app.use(morgan('combined', { stream: accessLogStream }));
app.use((0, morgan_1.default)('dev'));
// Enable CORS for all origins
app.use((0, cors_1.default)({ origin: '*' }));
// Other middlewares
app.use(express_1.default.json());
// Serve static files from the 'uploads' folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Register your routes
app.use(routes_1.default);
db_1.default.getConnection()
    .then((connection) => {
    console.log('Connected to the database');
    connection.release();
})
    .catch((err) => {
    console.error('Error connecting to the database:', err);
});
exports.default = app;
