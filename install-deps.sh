#!/bin/bash
echo "==================================="
echo "Installing Frontend Dependencies..."
echo "==================================="
cd frontend
npm install
echo
echo "==================================="
echo "Installing Backend Dependencies..."
echo "==================================="
cd ../backend
npm install
echo
echo "==================================="
echo "All dependencies installed!"
echo "==================================="
cd ..