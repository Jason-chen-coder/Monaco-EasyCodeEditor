<template>
  <div
    ref="container"
    class="monaco-editor"
    :style="`height: ${height}px`"
  ></div>
</template>

<script>
import * as monaco from 'monaco-editor'
// import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution'
// import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
// import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
// import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'

export default {
  name: 'AcMonaco',
  inject: ['reload'],
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
    },
    isDiff: {
      type: Boolean,
      default: false
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
      monacoEditor: {},
      oldValue: '',
      newValue: ''
    }
  },
  watch: {
    opts: {
      handler () {
        this.reload()
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
      if (!this.isDiff) {
        // 初始化编辑器实例
        this.monacoEditor = monaco.editor.create(this.$refs.container, editorOptions)
        // 编辑器内容发生改变时触发
        this.monacoEditor.onDidChangeModelContent(() => {
          this.$emit('change', this.monacoEditor.getValue())
        })
      } else {
        this.oldValue = this.readLocalFile('./testCode1.js');
        this.newValue = this.readLocalFile('./testCode2.js');
        editorOptions.readOnly = true;
        editorOptions.language = 'javascript'
        // editorOptions.inlineHints = true;
        // 初始化编辑器实例
        this.monacoDiffInstance = monaco.editor.createDiffEditor(this.$refs['container'], editorOptions)
        this.monacoDiffInstance.setModel({
          original: monaco.editor.createModel(this.oldValue, editorOptions.language),
          modified: monaco.editor.createModel(this.newValue, editorOptions.language)
        })

      }
    },
    upDateDiff (val) {
      this.monacoDiffInstance.updateOptions({
        renderSideBySide: !val
      });
    },
    // 供父组件调用手动获取值
    getVal () {
      return this.monacoEditor.getValue()
    },
    // 读取本地文件函数
    readLocalFile (fileUrl) {
      let xhr = null
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        // eslint-disable-next-line
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      }
      const okStatus = document.location.protocol === 'file' ? 0 : 200
      xhr.open('GET', fileUrl, false)
      xhr.overrideMimeType('text/html;charset=utf-8')
      xhr.send(null)
      return (xhr.status === okStatus ? xhr.responseText : null)
    },
  }
}
</script>

