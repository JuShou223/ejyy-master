import { hide } from '~/utils/phone';

// 功能测试：手机号脱敏（隐私展示逻辑）。
describe('utils/phone.hide', () => {
    it('遮蔽 11 位手机号的中间四位', () => {
        expect(hide('13812345678')).toBe('138****5678');
    });

    it('空输入返回 null', () => {
        expect(hide('')).toBeNull();
    });
});
