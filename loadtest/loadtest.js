import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,       // จำนวน virtual users
  duration: '30s' // รัน 30 วินาที
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'; // แก้เป็น 3000

export default function () {
  const res = http.get(`${BASE_URL}/menu`);
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
