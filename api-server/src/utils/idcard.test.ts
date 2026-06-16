import { verify, gender } from '~/utils/idcard';

// 功能测试：身份证工具的真实业务行为（含校验码算法），无需数据库/网络。
describe('utils/idcard', () => {
    describe('verify', () => {
        it('接受校验码正确的合法身份证号', () => {
            // 11010519491231002X 的加权校验位恰为 X
            expect(verify('11010519491231002X')).toBe(true);
        });

        it('拒绝校验位错误的号码', () => {
            expect(verify('110105194912310021')).toBe(false);
        });

        it('拒绝格式非法的输入', () => {
            expect(verify('123')).toBe(false);
            expect(verify('')).toBe(false);
        });
    });

    describe('gender', () => {
        it('第 17 位为奇数返回 1（男）', () => {
            expect(gender('00000000000000001')).toBe(1);
        });

        it('第 17 位为偶数返回 2（女）', () => {
            expect(gender('00000000000000002')).toBe(2);
        });

        it('空输入返回 0', () => {
            expect(gender('')).toBe(0);
        });
    });
});
