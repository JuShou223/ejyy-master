import { version } from './compare';

// 功能测试：版本比较（a 是否比 b 新，位数不同自动补零）。纯逻辑。
describe('utils/compare.version', () => {
    it('a 比 b 新返回 true', () => {
        expect(version('1.2.0', '1.1.9')).toBe(true);
    });

    it('a 比 b 旧返回 false', () => {
        expect(version('1.0.0', '1.0.1')).toBe(false);
    });

    it('版本相同返回 false（相同不算更新）', () => {
        expect(version('1.0.0', '1.0.0')).toBe(false);
    });

    it('位数不同自动补零比较：1.2 比 1.1.5 新', () => {
        expect(version('1.2', '1.1.5')).toBe(true);
    });
});
