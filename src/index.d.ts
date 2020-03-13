export interface XBlockInstance {
    /**
     *  启动应用
     * @param root
     */
    run: (root: string) => void,

    /**
     *  注册服务者
     * @param provider
     */
    provider: (provider: Object) => void,


}

export default function XBlock(): XBlockInstance;

