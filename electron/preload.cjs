/* eslint-disable no-undef */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('harInsight', {
  platform: process.platform,
});

