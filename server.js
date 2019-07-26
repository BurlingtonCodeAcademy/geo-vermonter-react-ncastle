// server side handling

// set up: 
const fs = require('fs');
const $path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;