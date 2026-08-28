import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const leadDate = new Date('2026-04-01T08:22:37');
const startDate = '2026-04-01';
const endDate = '';

const start = startDate ? startOfDay(new Date(startDate + 'T00:00:00')) : new Date(0);
const end = endDate ? endOfDay(new Date(endDate + 'T23:59:59')) : new Date(8640000000000000);

console.log('Lead Date:', leadDate);
console.log('Start Date:', start);
console.log('End Date:', end);
console.log('Is within:', isWithinInterval(leadDate, { start, end }));
