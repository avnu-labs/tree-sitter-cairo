const PREC = {
    primary: 7,
    unary: 6,
    multiplicative: 5,
    additive: 4,
    comparative: 3,
    and: 2,
    or: 1,
  },
  multiplicative_operators = ["*", "/", "%"],
  additive_operators = ["+", "-"],
  comparative_operators = ["==", "!=", "<", "<=", ">", ">="],
  assignment_operators = multiplicative_operators
    .concat(additive_operators)
    .map((op) => op + "=")
    .concat("="),
  terminator = ";";

module.exports = grammar({
  name: "cairo",

  extras: ($) => [$.comment, /\s/],

  conflicts: ($) => [[$._qualified_name], [$._statement, $._expression]],

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) =>
      choice(
        $.import,

        $.module_declaration,
        $.typealias_declaration,
        $.const_declaration,

        $.trait_declaration,
        $.struct_declaration,
        $.enum_declaration,
        $.impl_declaration,
        $.fun_declaration
      ),

    module_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "mod",
        field("name", $._name),
        choice(terminator, $.module_spec)
      ),

    module_spec: ($) => seq("{", repeat($._definition), "}"),

    import: ($) =>
      seq(
        "use",
        field("path", $._qualified_name),
        field("alias", optional(seq("as", $._name))),
        terminator
      ),

    const_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "const",
        field("name", $._name),
        ":",
        field("type", $._type),
        "=",
        field("value", $._const_value),
        terminator
      ),

    _const_value: ($) =>
      choice(
        seq(
          "(",
          repeat(seq($._const_value, ",")),
          optional($._const_value),
          ")"
        ),
        $._literal_expression
      ),

    typealias_declaration: ($) =>
      seq(
        "type",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        "=",
        field("type", $._type),
        terminator
      ),

    trait_declaration: ($) =>
      seq(
        "trait",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        field("spec", $.trait_declaration_list)
      ),

    trait_declaration_list: ($) => seq("{", repeat($.trait_fun), "}"),

    trait_fun: ($) =>
      seq(
        field("signature", $.fun_signature),
        choice(field("body", optional($.block)), terminator)
      ),

    struct_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "struct",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        choice(field("fields", $.member_declaration_list), terminator)
      ),

    enum_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "enum",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        field("variant", $.member_declaration_list)
      ),

    member_declaration_list: ($) =>
      seq(
        "{",
        repeat(seq($.member_declaration, ",")),
        optional($.member_declaration),
        "}"
      ),

    member_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        field("name", $._name),
        ":",
        field("type", $._type)
      ),

    impl_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "impl",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        "of",
        field("type", $._type),
        field("spec", $.impl_spec)
      ),

    impl_spec: ($) => seq("{", repeat($._definition), "}"),

    fun_declaration: ($) =>
      seq(field("signature", $.fun_signature), field("body", $.block)),

    fun_signature: ($) =>
      seq(
        field("attributes", repeat($.attribute_list)),
        "fn",
        field("name", $._name),
        field("generic_parameters", optional($.generic_parameter_list)),
        field("parameters", $.parameter_list),
        field("return_type", optional(seq("->", $._type)))
      ),

    parameter_list: ($) =>
      seq(
        "(",
        repeat(seq($.parameter_declaration, ",")),
        optional($.parameter_declaration),
        ")"
      ),

    parameter_declaration: ($) =>
      seq(
        field("modifiers", repeat($._modifier)),
        field("name", $._name),
        ":",
        field("type", $._type)
      ),

    generic_parameter_list: ($) =>
      seq(
        "<",
        repeat(seq($._generic_declaration, ",")),
        optional($._generic_declaration),
        ">"
      ),

    _generic_declaration: ($) =>
      choice(
        $.generic_const_declaration,
        $.generic_impl_declaration,
        $.generic_parameter_declaration
      ),

    generic_parameter_declaration: ($) => $._name,
    generic_const_declaration: ($) =>
      seq("const", field("name", $._name), ":", field("type", $._type)),
    generic_impl_declaration: ($) =>
      seq("impl", field("name", $._name), ":", field("type", $._type)),

    block: ($) =>
      seq("{", seq(repeat(seq($._statement)), optional($._expression)), "}"),

    _statement: ($) =>
      choice(
        $.let_statement,
        $.assignment_statement,
        $.return_statement,
        $.break_statement,

        $.if_expression,
        $.loop_expression,
        $.match_expression,

        seq($._expression, terminator)
      ),

    let_statement: ($) =>
      seq(
        "let",
        field("modifier", optional($.modifier_mut)),
        field("pattern", choice($._pattern)),
        field("type", optional(seq(":", $._type))),
        "=",
        field("value", $._expression),
        terminator
      ),

    assignment_statement: ($) =>
      seq(
        field("lhs", $._expression),
        field("operator", choice(...assignment_operators)),
        field("rhs", $._expression),
        terminator
      ),

    return_statement: ($) => seq("return", $._expression, terminator),

    break_statement: ($) => seq("break", $._expression, terminator),

    _expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.curlied_expression,

        $.unary_expression,
        $.binary_expression,

        $.if_expression,
        $.loop_expression,
        $.match_expression,
        $.selector_expression,

        $.call_expression,

        $._literal_expression,

        $.empty_expression
      ),

    _simple_expression: ($) =>
      choice(
        $.parenthesized_expression,

        $.unary_expression,
        $.binary_expression,

        $.if_expression,
        $.loop_expression,
        $.match_expression,
        $.selector_expression,

        $.call_expression,

        $._literal_expression
      ),

    empty_expression: ($) => seq("{", "}"),

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(
          field("operator", choice("!", "*", "-")),
          field("value", $._expression)
        )
      ),

    binary_expression: ($) => {
      const table = [
        [PREC.multiplicative, choice(...multiplicative_operators)],
        [PREC.additive, choice(...additive_operators)],
        [PREC.comparative, choice(...comparative_operators)],
        [PREC.and, "&&"],
        [PREC.or, "||"],
      ];

      return choice(
        ...table.map(([precedence, operator]) =>
          prec.left(
            precedence,
            seq(
              field("lhs", $._expression),
              field("operator", operator),
              field("rhs", $._expression)
            )
          )
        )
      );
    },

    parenthesized_expression: ($) =>
      seq(
        "(",
        optional(seq(repeat(seq($._expression, ",")), $._expression)),
        ")"
      ),

    curlied_expression: ($) => seq("{", $._expression, "}"),

    if_expression: ($) =>
      prec.right(
        seq(
          "if",
          field("condition", $._simple_expression),
          field("then", $._if_then),
          field("else", optional($._if_else))
        )
      ),

    _if_then: ($) => $.block,
    _if_else: ($) => seq("else", choice($.if_expression, $.block)),

    loop_expression: ($) => seq("loop", "{", $._expression, "}"),

    match_expression: ($) =>
      seq(
        "match",
        field("subject", $._expression),
        field("match_arms", $.match_arm_list)
      ),

    match_arm_list: ($) =>
      seq("{", repeat(seq($.match_arm, ",")), optional($.match_arm), "}"),

    match_arm: ($) =>
      seq(
        field("pattern", $._match_arm_pattern),
        "=>",
        field("value", $._expression)
      ),

    _match_arm_pattern: ($) =>
      choice($._pattern, $._number, $.false, $.true, $.string),

    call_expression: ($) =>
      prec(
        PREC.primary,
        seq(
          field("subject", $._expression),
          field("generic_arguments", optional($.generic_argument_list)),
          field("arguments", $.argument_list)
        )
      ),

    generic_argument_list: ($) =>
      seq("::", "<", repeat($._literal_expression), ">"),

    argument_list: ($) =>
      seq(
        "(",
        optional(seq(repeat(seq($._expression, ",")), $._expression)),
        ")"
      ),

    selector_expression: ($) =>
      seq(field("value", $._expression), ".", field("field", $._name)),

    _literal_expression: ($) =>
      choice(
        $.true,
        $.false,
        $._number,
        $.string,

        $.identifier
      ),

    attribute_list: ($) => seq("#", "[", repeat1($.attribute), "]"),

    attribute: ($) =>
      seq($._qualified_name, optional($._attribute_argument_list)),

    _attribute_argument_list: ($) =>
      seq(
        "(",
        repeat(seq($.attribute_argument, ",")),
        optional($.attribute_argument),
        ")"
      ),
    attribute_argument: ($) =>
      choice(
        $._literal_expression,
        seq($._qualified_name, ":", $._literal_expression),
        seq($._qualified_name, ":", $._attribute_argument_list)
      ),

    _modifier: ($) => choice($.modifier_ref, $.modifier_mut),

    modifier_ref: ($) => "ref",

    modifier_mut: ($) => "mut",

    _name: ($) => /_|[a-zA-Z][a-zA-Z0-9_]*/,
    _qualified_name: ($) => seq(repeat(seq($._name, "::")), $._name),

    _wildcard: ($) => "_",

    identifier: ($) => choice($._wildcard, $._qualified_name),

    _type: ($) => choice($.type_tuple, $.unit_type, $.type_identifier),

    type_tuple: ($) => seq("(", repeat(seq($._type, ",")), $._type, ")"),

    unit_type: ($) => seq("(", ")"),

    type_identifier: ($) => seq($._qualified_name, optional($.type_arguments)),

    type_arguments: ($) => seq("<", repeat(seq($._type, ",")), $._type, ">"),

    _pattern: ($) =>
      choice($.pattern_var, $.pattern_struct, $.pattern_enum, $.pattern_tuple),

    pattern_var: ($) => $._name,

    pattern_struct: ($) =>
      seq($._qualified_name, "{", list1($._pattern_struct_elem), "}"),

    _pattern_struct_elem: ($) =>
      choice($._qualified_name, seq($._name, ":", $._pattern)),

    pattern_enum: ($) => seq($._qualified_name, "(", list1($._pattern), ")"),

    pattern_tuple: ($) => seq("(", list1($._pattern), ")"),

    true: ($) => "true",
    false: ($) => "false",
    _number: ($) => choice($.integer, $.hex, $.octal, $.binary),
    _number_suffix: ($) => /_[a-z][a-z0-9]+/,

    integer: ($) => seq(/[0-9]+/, optional($._number_suffix)),
    hex: ($) => seq(/0x[0-9a-f]+/, optional($._number_suffix)),
    octal: ($) => seq(/0o[0-7]+/, optional($._number_suffix)),
    binary: ($) => seq(/0b[01]+/, optional($._number_suffix)),

    string: ($) => /'[^']*'/,

    comment: ($) => token(seq("//", /.*/, "\n")),
  },
});

function list1(rule) {
  return seq(repeat(seq(rule, ",")), rule)
}