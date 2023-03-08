<template>
    <div>
        <el-color-picker
                class="theme-picker"
                popper-class="theme-picker-dropdown"
                v-model="theme"
                :size="size">
        </el-color-picker>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    const version = require('element-ui/package.json').version;
    const ORIGINAL_THEME = '#409EFF';
    export default {
        name: 'ThemePickerColor',
        props: {
            size: {
                type: String,
                default: 'small'
            }
        },
        data() {
            return {
                chalk: '', // content of theme-chalk css
                theme: ORIGINAL_THEME,
                isShow: true // 是否弹出成功消息弹框
            };
        },
        computed: {
　　　　　　　//使用vuex计算属性实时更新数据
            ...mapGetters(['themeColor']),
            themeColorInfo: {
                get() {
                    return this.themeColor;
                },
                set(val) {
                    this.SET_THEMECOLOR(val);
                }
            }
        },
        mounted() {
            if (this.themeColor != null) {
　　　　　　　　　　//将vuex中的值赋值给声明的变量中
                this.theme = this.themeColor;
　　　　　　　　　　//vuex存储数据
                this.SET_THEMECOLOR(this.theme);
                this.isShow = false;
            }
        },
        watch: {
            theme(val, oldVal) {
                if (typeof val !== 'string') return;
                const themeCluster = this.getThemeCluster(val.replace('#', ''));
                const originalCluster = this.getThemeCluster(oldVal.replace('#', ''));
                const getHandler = (variable, id) => {
                    return () => {
                        const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''));
                        const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster);

                        let styleTag = document.getElementById(id);
                        if (!styleTag) {
                            styleTag = document.createElement('style');
                            styleTag.setAttribute('id', id);
                            document.head.appendChild(styleTag);
                        }
                        styleTag.innerText = newStyle;
                    };
                };
                const styles = [].slice.call(document.querySelectorAll('style'))
                    .filter(style => {
                        const text = style.innerText;
                        return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
                    });
                styles.forEach(style => {
                    const { innerText } = style;
                    if (typeof innerText !== 'string') return;
                    style.innerText = this.updateStyle(innerText, originalCluster, themeCluster);
                });

                // 响应外部操作
                this.SET_THEMECOLOR(this.theme);

                if (this.isShow) {
                    this.$message({
                        message: '换肤成功',
                        type: 'success'
                    });
                } else {
                    this.isShow = true;
                }
            }
        },
        methods: {
            ...mapMutations(['SET_THEMECOLOR']),
            updateStyle(style, oldCluster, newCluster) {
                let newStyle = style;
                oldCluster.forEach((color, index) => {
                    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
                });
                return newStyle;
            },

            getCSSString(url, callback, variable) {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
                        callback();
                    }
                };
                xhr.open('GET', url);
                xhr.send();
            },

            getThemeCluster(theme) {
                const tintColor = (color, tint) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    if (tint === 0) {
                        return [red, green, blue].join(',');
                    } else {
                        red += Math.round(tint * (255 - red));
                        green += Math.round(tint * (255 - green));
                        blue += Math.round(tint * (255 - blue));

                        red = red.toString(16);
                        green = green.toString(16);
                        blue = blue.toString(16);

                        return `#${red}${green}${blue}`;
                    }
                };

                const shadeColor = (color, shade) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    red = Math.round((1 - shade) * red);
                    green = Math.round((1 - shade) * green);
                    blue = Math.round((1 - shade) * blue);

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    return `#${red}${green}${blue}`;
                };

                const clusters = [theme];
                for (let i = 0; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
                }
                clusters.push(shadeColor(theme, 0.1));
                return clusters;
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>