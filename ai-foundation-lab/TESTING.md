# Testing Guide

This project uses **Vitest** for unit testing (logic, validation, parsing) and **Playwright** for end-to-end (E2E) testing (real browser automation).

## 1. Unit Tests (Vitest)

Unit tests verify the pure logic in our application. They run in a simulated browser environment (`jsdom`) and are extremely fast.

### Running unit tests
```bash
npm run test:unit