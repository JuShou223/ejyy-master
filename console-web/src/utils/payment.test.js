import { yuan } from '@/utils/payment';

// 功能测试：金额格式化（分 → 元）。纯逻辑，无浏览器。
describe('utils/payment.yuan', () => {
    it('12345 分 = 123.45 元', () => {
        expect(yuan(12345)).toBe(123.45);
    });

    it('整元：100 分 = 1 元', () => {
        expect(yuan(100)).toBe(1);
    });

    it('个位分补零：105 分 = 1.05 元', () => {
        expect(yuan(105)).toBe(1.05);
    });

    it('不足一元：5 分 = 0.05 元', () => {
        expect(yuan(5)).toBe(0.05);
    });
});
