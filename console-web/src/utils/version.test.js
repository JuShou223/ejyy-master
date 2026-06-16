import { compare } from '@/utils/version';

// 功能测试：版本比较（v1 新版本是否比 v2 老版本更新）。纯逻辑，无浏览器。
describe('utils/version.compare', () => {
    it('v1 比 v2 新返回 true', () => {
        expect(compare('1.2.0', '1.1.9')).toBe(true);
    });

    it('v1 比 v2 旧返回 false', () => {
        expect(compare('1.0.0', '1.0.1')).toBe(false);
    });

    it('版本相同返回 false（相同不算更新）', () => {
        expect(compare('1.0.0', '1.0.0')).toBe(false);
    });

    it('没有旧版本（v2 为空）返回 true', () => {
        expect(compare('2.0.0', '')).toBe(true);
    });

    it('版本位数不同返回 false', () => {
        expect(compare('1.0', '1.0.0')).toBe(false);
    });
});
