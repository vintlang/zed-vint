(comment) @comment

(string) @string
(escape_sequence) @string.escape

(number) @number
(boolean) @constant.builtin
(null) @constant.builtin

(identifier) @variable

(call_expression
  function: (call_expression) @function)
(call_expression
  function: (member_expression) @function.method)

(variable_declaration
  value: (function_expression) @function)

((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

((identifier) @function.builtin
  (#match? @function.builtin "^(print|println|write|type|convert|has_key|len|range|split|join|replace|contains|startsWith|endsWith|trim|upper|lower|substring|indexOf|lastIndexOf|charAt|charCodeAt|padStart|padEnd|repeat|toUpper|toLower|reverse|push|pop|shift|unshift|slice|splice|sort|map|filter|reduce|find|findIndex|includes|forEach|abs|ceil|floor|round|max|min|sqrt|pow|random|sin|cos|tan|log|exp|asin|acos|atan|atan2|cbrt|readFile|writeFile|appendFile|deleteFile|fileExists|readDir|makeDir|open|keys|values|entries|merge|clone|freeze|seal|toFixed|parseInt|parseFloat|isString|isNumber|isArray|isMap|isNull|isBool|exec|env|args|exit|send|receive|close|stringify)$"))

((identifier) @module
  (#match? @module "^(time|net|os|json|csv|regex|crypto|encoding|colors|term|math|string|array|argparse|cli|uuid|filewatcher|kv|random)$"))

[
  "import"
  "package"
  "include"
  "let"
  "func"
  "return"
  "break"
  "continue"
  "throw"
  "if"
  "elif"
  "else"
  "for"
  "in"
  "while"
  "switch"
  "case"
  "default"
  "try"
  "catch"
  "finally"
  "defer"
  "go"
  "async"
  "await"
  "chan"
] @keyword

[
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
  "|"
  "^"
  "&"
  "~"
  "+"
  "-"
  "*"
  "/"
  "%"
  "**"
  "++"
  "--"
  "?"
  ":"
] @operator

[
  "."
  ","
  ";"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket
