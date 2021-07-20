# easy-codeeditor
# Monaco在线代码编辑器使用总结
## 1.什么是Monaco
    Monaco编辑器是为VS代码提供支持的代码编辑器
[官方API文档](https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html)
## 2.Monaco Editor安装及使用

#### 2.1安装

```cmd
npm install monaco-editor --save-dev

npm install monaco-editor-webpack-plugin --save-dev
```

#### 2.2配置vue.config.js

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin()
        ]
    }
}

```
#### 2.3 开始使用

##### 2.3.1.vue文件中导入monaco

```js
import * as monaco from 'monaco-editor'
```

##### 2.3.2.创建代码编辑区域

```html
 <div ref="container" class="monaco-editor"></div>
```

#### 2.3.3.初始化container

##### 2.3.3.1 准备monaco基础配置

```js
  data () {
    return {
      // 主要配置
      defaultOpts: {
       // 编辑器的值
        value: '',
         // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        theme: 'vs-dark',
        // 右侧不显示编辑器预览框
        roundedSelection: true, 
        // 自动缩进
        autoIndent: true ,
        // 是否只读
        readOnly: false, 
        // 语言类型java,c,php更多选择详见官网
        language: 'javascript', 
      }
        // 编辑器对象
      monacoEditor: {}
    }
  },
```

##### 2.3.3.2 初始化monaco编辑器

```js
methods: {
    init () {
      // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''
      // 生成编辑器配置
      let editorOptions = Object.assign(this.defaultOpts, this.opts)
      // 生成编辑器对象
      this.monacoEditor = monaco.editor.create(this.$refs.container, editorOptions)
      // 编辑器内容发生改变时触发
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit('change', this.monacoEditor.getValue())
      })
    },
   // 手动编辑器中的内容
   getValue() {
        this.$message.info(this.$refs.monaco.getVal())
    },
}
```

##### 整体源码:

1) **monacoeditor.vue**
```html
<template>
  <div
    ref="container"
    class="monaco-editor"
    :style="`height: ${height}px`"
  ></div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'AcMonaco',
  props: {
    opts: {
      type: Object,
      default () {
        return {}
      }
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      // 主要配置
      defaultOpts: {
        value: '', // 编辑器的值
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: true, // 右侧不显示编辑器预览框
        autoIndent: true // 自动缩进
      },
      // 编辑器对象
      monacoEditor: {}
    }
  },
  watch: {
    opts: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''
      // 生成编辑器配置
      let editorOptions = Object.assign(this.defaultOpts, this.opts)
      // 生成编辑器对象
      this.monacoEditor = monaco.editor.create(this.$refs.container, editorOptions)
      // 编辑器内容发生改变时触发
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit('change', this.monacoEditor.getValue())
      })
    },
    // 供父组件调用手动获取值
    getVal () {
      return this.monacoEditor.getValue()
    }
  }
}
</script>

```

2) **App.vue**

```html

<template>
  <div>
    <div id="app">
      <img
        alt="Vue logo"
        style="width: 200px; height: 200px"
        src="./assets/logo.png"
      />
      <h1>Easy-CodeEditor</h1>
      <div>
        语言：
        <el-select
          v-model="opts.language"
          clearable
          placeholder="请选择"
          size="mini"
          @change="changeLanguage"
        >
          <el-option
            v-for="item in sets.language"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        样式风格：
        <el-select
          v-model="opts.theme"
          clearable
          placeholder="请选择"
          size="mini"
          @change="changeTheme"
        >
          <el-option
            v-for="item in sets.theme"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="getValue"
          >获取内容</el-button
        >
      </div>
    </div>
    <div>
      <!--调用子组件-->
      <monaco
        ref="monaco"
        :opts="opts"
        @change="changeValue"
        :height="600"
      ></monaco>
    </div>
  </div>
</template>
<script>
import monaco from './components/monacoeditor'
export default {
  components: { monaco },
  data () {
    return {
      sets: {
        language: {
          'apex': 'apex',
          'azcli': 'azcli',
          'bat': 'bat',
          'c': 'c',
          'clojure': 'clojure',
          'coffeescript': 'coffeescript',
          'cpp': 'cpp',
          'csharp': 'csharp',
          'csp': 'csp',
          'css': 'css',
          'dockerfile': 'dockerfile',
          'fsharp': 'fsharp',
          'go': 'go',
          'graphql': 'graphql',
          'handlebars': 'handlebars',
          'html': 'html',
          'ini': 'ini',
          'java': 'java',
          'javascript': 'javascript',
          'json': 'json',
          'kotlin': 'kotlin',
          'less': 'less',
          'lua': 'lua',
          'markdown': 'markdown',
          'msdax': 'msdax',
          'mysql': 'mysql',
          'objective-c': 'objective-c',
          'pascal': 'pascal',
          'perl': 'perl',
          'pgsql': 'pgsql',
          'php': 'php',
          'plaintext': 'plaintext',
          'postiats': 'postiats',
          'powerquery': 'powerquery',
          'powershell': 'powershell',
          'pug': 'pug',
          'python': 'python',
          'r': 'r',
          'razor': 'razor',
          'redis': 'redis',
          'redshift': 'redshift',
          'ruby': 'ruby',
          'rust': 'rust',
          'sb': 'sb',
          'scheme': 'scheme',
          'scss': 'scss',
          'shell': 'shell',
          'sol': 'sol',
          'sql': 'sql',
          'st': 'st',
          'swift': 'swift',
          'tcl': 'tcl',
          'typescript': 'typescript',
          'vb': 'vb',
          'xml': 'xml',
          'yaml': 'yaml'
        },
        theme: {
          'vs': 'vs',
          'vs-dark': 'vs-dark',
          'hc-black': 'hc-black'
        }
      },
      opts: {
        value: '',
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs-dark' // 编辑器主题
      }
    }
  },
  methods: {
    changeLanguage (val) {
      this.opts.language = val
    },
    changeTheme (val) {
      this.opts.theme = val
    },
    // 手动获取值
    getValue () {
      this.$message.info('代码已输出至控制台');
      console.log('输出代码:' + this.$refs.monaco.getVal())
    },
    // 内容改变自动获取值
    changeValue (val) {
      console.log(val)
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


```
##### 2.3.3.3 效果:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210319153511554.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)


##### 2.3.3.4 注意:

 1)当我们修改了defaultOpts的配置后我们需要重新初始化monaco编辑器;即重新执行this.init();

#### 2.4 编辑器代码diff的实现

```js
init () {
 // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''
      // 生成编辑器配置
      let editorOptions = Object.assign(this.defaultOpts, this.opts)
       editorOptions.readOnly = true;
       editorOptions.language = 'javascript'
      // 初始化编辑器实例
      this.monacoDiffInstance = monaco.editor.createDiffEditor(this.$refs['container'],editorOptions)
      this.monacoDiffInstance.setModel({
      // oldValue为以前的值
      original: monaco.editor.createModel(this.oldValue, editorOptions.language),
       // oldValue为新的值
      modified: monaco.editor.createModel(this.newValue, editorOptions.language)
      })
    }
```
 **效果:**:
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2021031915354219.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)

 
 ##### 2.4.1切换为行内比较
 
 ```js
//直接升级配置项 renderSideBySide: false 即可
this.monacoDiffInstance.updateOptions({
        renderSideBySide: false
      });
```

**效果:**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210319153558909.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTA4NTgyMg==,size_16,color_FFFFFF,t_70)


### [本文章项目地址](https://github.com/Jason-chen-coder/easy-codeEditor)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
