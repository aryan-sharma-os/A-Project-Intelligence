import yahooFinance from 'yahoo-finance2';
import * as allExports from 'yahoo-finance2';

console.log("Default export type:", typeof yahooFinance);
if (typeof yahooFinance === 'function') {
  console.log("Is it a class?", yahooFinance.toString().startsWith('class'));
} else if (typeof yahooFinance === 'object') {
  console.log("Keys on default:", Object.keys(yahooFinance));
}

console.log("All exports:", Object.keys(allExports));
