import { mergeTests } from '@playwright/test';
import { test as pageTest } from './page.fixture';
import { test as apiTest } from './api.fixture';

export const test = mergeTests(pageTest, apiTest);
