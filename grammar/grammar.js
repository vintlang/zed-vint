/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'vint',

  extras: $ => [
    $.comment,
    /[\s\p{Zs}\uFEFF\u2028\u2029]/,
  ],

  conflicts: $ => [
    [$.call_expression, $.member_expression],

  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.import_statement,
      $.package_statement,
      $.include_statement,
      $.variable_declaration,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.throw_statement,
      $.if_statement,
      $.for_statement,
      $.while_statement,
      $.switch_statement,
      $.try_statement,
      $.defer_statement,
      $.go_statement,
      $.expression_statement,
      $.block,
    ),

    import_statement: $ => seq('import', $.identifier),
    package_statement: $ => seq('package', $.identifier),
    include_statement: $ => seq('include', $._expression),

    variable_declaration: $ => seq('let', $.identifier, '=', $._expression),

    return_statement: $ => seq('return', $._expression),
    break_statement: _ => 'break',
    continue_statement: _ => 'continue',
    throw_statement: $ => seq('throw', $._expression),

    if_statement: $ => seq(
      'if', '(', $._expression, ')', $._statement,
      optional(seq('elif', '(', $._expression, ')', $._statement)),
      optional(seq('else', $._statement)),
    ),

    for_statement: $ => seq(
      'for', optional(seq($.identifier, 'in')), $._expression, $._statement,
    ),

    while_statement: $ => seq(
      'while', '(', $._expression, ')', $._statement,
    ),

    switch_statement: $ => seq(
      'switch', '(', $._expression, ')', '{',
      repeat($.case_clause),
      optional($.default_clause),
      '}',
    ),

    case_clause: $ => seq('case', $._expression, ':', repeat($._statement)),
    default_clause: $ => seq('default', ':', repeat($._statement)),

    try_statement: $ => seq(
      'try', $._statement,
      optional($.catch_clause),
      optional($.finally_clause),
    ),

    catch_clause: $ => seq('catch', '(', $.identifier, ')', $._statement),
    finally_clause: $ => seq('finally', $._statement),

    defer_statement: $ => seq('defer', $._expression),
    go_statement: $ => seq('go', $._expression),

    expression_statement: $ => seq($._expression, optional(';')),

    block: $ => seq('{', repeat($._statement), '}'),

    _expression: $ => choice(
      $.assignment_expression,
      $.ternary_expression,
    ),

    ternary_expression: $ => choice(
      prec.left(1, seq($.logical_or_expression, '?', $._expression, ':', $._expression)),
      $.logical_or_expression,
    ),

    logical_or_expression: $ => choice(
      prec.left(2, seq($.logical_or_expression, '||', $.logical_and_expression)),
      $.logical_and_expression,
    ),

    logical_and_expression: $ => choice(
      prec.left(3, seq($.logical_and_expression, '&&', $.bitwise_or_expression)),
      $.bitwise_or_expression,
    ),

    bitwise_or_expression: $ => choice(
      prec.left(4, seq($.bitwise_or_expression, '|', $.bitwise_xor_expression)),
      $.bitwise_xor_expression,
    ),

    bitwise_xor_expression: $ => choice(
      prec.left(5, seq($.bitwise_xor_expression, '^', $.bitwise_and_expression)),
      $.bitwise_and_expression,
    ),

    bitwise_and_expression: $ => choice(
      prec.left(6, seq($.bitwise_and_expression, '&', $.comparison_expression)),
      $.comparison_expression,
    ),

    comparison_expression: $ => choice(
      prec.left(7, seq(
        $.comparison_expression,
        choice('==', '!=', '<=', '>=', '<', '>'),
        $.additive_expression,
      )),
      $.additive_expression,
    ),

    additive_expression: $ => choice(
      prec.left(8, seq($.additive_expression, choice('+', '-'), $.multiplicative_expression)),
      $.multiplicative_expression,
    ),

    multiplicative_expression: $ => choice(
      prec.left(9, seq($.multiplicative_expression, choice('*', '/', '%'), $.power_expression)),
      $.power_expression,
    ),

    power_expression: $ => choice(
      prec.right(10, seq($.unary_expression, '**', $.power_expression)),
      $.unary_expression,
    ),

    unary_expression: $ => choice(
      prec(11, seq(choice('!', '-', '~'), $.unary_expression)),
      $.update_expression,
    ),

    update_expression: $ => choice(
      prec(12, seq($.update_expression, choice('++', '--'))),
      prec(12, seq(choice('++', '--'), $.update_expression)),
      $.call_expression,
    ),

    call_expression: $ => choice(
      prec(13, seq($.call_expression, '(', optional(commaSep($._expression)), ')')),
      $.member_expression,
    ),

    member_expression: $ => choice(
      prec(14, seq($.member_expression, '.', $.identifier)),
      prec(14, seq($.member_expression, '[', $._expression, ']')),
      $.primary_expression,
    ),

    assignment_expression: $ => prec.right(15, seq(
      choice($.call_expression, $.member_expression, $.identifier),
      choice('=', '+=', '-=', '*=', '/=', '%='),
      $._expression,
    )),

    primary_expression: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.null,
      $.identifier,
      $.array_literal,
      $.object_literal,
      $.function_expression,
      $.channel_literal,
      $.async_expression,
      $.await_expression,
      seq('(', $._expression, ')'),
    ),

    function_expression: $ => seq(
      optional('async'),
      'func',
      '(',
      optional(commaSep($.identifier)),
      ')',
      $._statement,
    ),

    async_expression: $ => prec(16, seq('async', $._expression)),
    await_expression: $ => prec(16, seq('await', $._expression)),

    channel_literal: $ => seq('chan', optional(seq('(', $._expression, ')'))),

    array_literal: $ => seq('[', optional(commaSep($._expression)), ']'),

    object_literal: $ => seq('{', optional(commaSep($.pair)), '}'),

    pair: $ => seq($._expression, ':', $._expression),

    string: $ => choice(
      seq('"', optional($._double_string_content), '"'),
      seq("'", optional($._single_string_content), "'"),
    ),

    _double_string_content: $ => repeat1(choice(
      token.immediate(prec(1, /[^"\\\n]+/)),
      $.escape_sequence,
    )),

    _single_string_content: $ => repeat1(choice(
      token.immediate(prec(1, /[^'\\\n]+/)),
      $.escape_sequence,
    )),

    escape_sequence: _ => token(choice(
      seq('\\', /[\\'"nrtbf\/]/),
      seq('\\u', /[0-9a-fA-F]{4}/),
    )),

    number: _ => token(choice(
      /\d+\.\d+([eE][+-]?\d+)?/,
      /0[xX][0-9a-fA-F]+/,
      /0[oO][0-7]+/,
      /0[bB][01]+/,
      /\d+([eE][+-]?\d+)?/,
    )),

    boolean: _ => choice('true', 'false'),
    null: _ => 'null',

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: _ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
