export default new Map(Object.entries({
    "minpiler": {
        src_link: "https://github.com/neumond/minpiler/",
        load: minpiler_load,
    },
    "pyndustric": {
        src_link: "https://codeberg.org/lonami/pyndustric/",
        load: pyndustric_load,
    },
    "py2mlog": {
        src_link: "https://github.com/FranticToaster1024/py2mlog/",
        load: py2mlog_load,
    },
    "mlog_py": {
        src_link: "https://github.com/annguyen2k8/mlog-py/",
        load: mlog_py_load,
    },
}));





function minpiler_load(pyodide) {
    return pyodide.pyimport("minpiler.cmdline").py_to_mind;
}
function pyndustric_load(pyodide) {
    const compiler_module = pyodide.pyimport("pyndustric.compiler");
    return (src) => compiler_module.Compiler().compile(src);
}
function py2mlog_load(pyodide) {
    return pyodide.pyimport("py2mlog.api").compile_src_to_mlog;
}
function mlog_py_load(pyodide) {
    return (src) => pyodide.pyimport("mlog.mlog").compile_py(src).mlog;
}