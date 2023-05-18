const PREC = {
    name: 10,
    primary: 9,
    unary: 8,
    multiplicative: 7,
    additive: 6,
    comparative: 5,
    bit_and: 4,
    bit_or: 3,
    and: 2,
    or: 1,
    tail: 0,
    statement: -1,
  },
  unary_operator = ['!', '*', '-'],
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

  conflicts: ($) => [
    [$.qualified_name, $.qualified_name_segment],
  ],

  inline: ($) => [
    $._declaration,
    $._type,
    $._pattern,
    $._pattern_struct_binding,
    $._impl_declaration,
    $._statement,
    $._expression,
    $._simple_expression,
    $._match_case_pattern,
    $._pattern_var,
    $._literal_expression,
    $._pattern,
    $._modifier,
    $._identifier,
  ],

  rules: {
    source_file: ($) => repeat($._declaration),

    _declaration: ($) =>
      choice(
        $.import_declaration,

        $.module_declaration,
        $.typealias_declaration,
        $.const_declaration,

        $.trait_declaration,
        $.struct_declaration,
        $.enum_declaration,
        $._impl_declaration,
        $.function_declaration
      ),

    // ******************************************
    // Declaration
    // ******************************************
    path: ($) => prec.left(list1($.name, "::")),

    module_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "mod",
        field("name", $.name),
        choice(terminator, $.module_body)
      ),

    module_body: ($) => seq("{", repeat($._declaration), "}"),

    import_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "use",
        field("path", $.path),
        field("alias", optional(seq("as", $.name))),
        terminator
      ),

    const_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "const",
        field("name", $.name),
        ":",
        field("type", $._type),
        "=",
        field("value", $._expression),
        terminator
      ),

    typealias_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "type",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        "=",
        field("type", $._type),
        terminator
      ),

    trait_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "trait",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        field("body", $.trait_body)
      ),

    trait_body: ($) => seq("{", repeat($.trait_function), "}"),

    // Only function prototype allowed for now, no default implementation
    trait_function: ($) => seq($.function_signature, terminator),

    struct_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "struct",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        choice(field("fields", $.member_declarations), terminator)
      ),

    enum_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "enum",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        field("variants", $.member_declarations)
      ),

    member_declarations: ($) => seq("{", list($.member_declaration, ","), "}"),

    member_declaration: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field("name", $.name),
        ":",
        field("type", $._type)
      ),

    _impl_declaration: ($) => choice($.impl_base, $.impl_trait),

    // Impl MyType
    impl_base: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "impl",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        field("body", $.impl_body)
      ),

    // Impl MyType of MyTrait
    impl_trait: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "impl",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        "of",
        field("trait", $.qualified_name),
        field("body", $.impl_body)
      ),

    impl_body: ($) => seq("{", repeat($._declaration), "}"),

    function_declaration: ($) =>
      seq(field("signature", $.function_signature), field("body", $.block)),

    function_signature: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        "fn",
        field("name", $.name),
        field("type_parameters", optional($.type_parameters)),
        field("parameters", $.parameters),
        field("return_type", optional(seq("->", $._type)))
      ),

    parameters: ($) => seq("(", list($.parameter, ","), ")"),

    parameter: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field("modifiers", repeat($._modifier)),
        field("name", $.name),
        ":",
        field("type", $._type)
      ),

    type_parameters: ($) => seq("<", list1($._type_parameter, ","), ">"),

    _type_parameter: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field(
          "parameter",
          choice($.name, $.type_parameter_const, $.type_parameter_impl)
        )
      ),

    type_parameter_const: ($) =>
      seq("const", field("name", $.name), ":", field("type", $._type)),

    type_parameter_impl: ($) =>
      seq("impl", field("name", $.name), ":", field("type", $._type)),

    // ******************************************
    // Expression - Statements
    // ******************************************
    block: ($) =>
      seq("{", seq(repeat(seq($.statement)), optional($.tail_expression)), "}"),

    tail_expression: ($) =>
      prec(
        PREC.tail,
        seq(
          field("attributes", repeat($.attribute)),
          field("expr", $._expression)
        )
      ),

    statement: ($) =>
      prec(PREC.statement, seq(
        field("attributes", repeat($.attribute)),
        field(
          "statement",
          choice(
            $.let_statement,
            $.assignment_statement,
            $.return_statement,
            $.break_statement,

            // Depending on the context, these expressions can be interpreted as
            // statement
            $.if_expression,
            $.loop_expression,
            $.match_expression,

            seq($._expression, terminator)
          )
        )
      )),

    let_statement: ($) =>
      seq(
        "let",
        field("modifier", optional($.modifier_mut)),
        field("pattern", $._pattern),
        field("type", optional(seq(":", $._type))),
        "=",
        field("value", $._expression),
        terminator
      ),

    assignment_statement: ($) =>
      seq(
        field("lhs", choice($.name, $.wildcard)),
        field("operator", choice(...assignment_operators)),
        field("rhs", $._expression),
        terminator
      ),

    return_statement: ($) => seq("return", optional($._expression), terminator),

    break_statement: ($) => seq("break", optional($._expression), terminator),

    _expression: ($) =>
      choice(
        $.tuple_expressions,
        $.block,

        $.unary_expression,
        $.binary_expression,

        $.if_expression,
        $.loop_expression,
        $.match_expression,

        $.selector_expression,
        $.index_expression,

        $.call_expression,

        $.qualified_name,
        $._literal_expression
      ),

    // Expression that cannot be surrounded by brackets (Ex. if condition)
    _simple_expression: ($) =>
      choice(
        $.tuple_expressions,

        $.unary_expression,
        $.binary_expression,

        $.if_expression,
        $.loop_expression,
        $.match_expression,

        $.selector_expression,
        $.index_expression,

        $.call_expression,

        $.qualified_name,
        $._literal_expression
      ),

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(
          field("operator", choice(...unary_operator)),
          field("operand", $._expression)
        )
      ),

    binary_expression: ($) => {
      const table = [
        [PREC.multiplicative, choice(...multiplicative_operators)],
        [PREC.additive, choice(...additive_operators)],
        [PREC.comparative, choice(...comparative_operators)],
        [PREC.bit_and, "&"],
        [PREC.bit_or, "|"],
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

    tuple_expressions: ($) => seq("(", list1($.tuple_expression, ","), ")"),

    tuple_expression: ($) =>
      seq(
        field("attributes", optional($.attribute)),
        field("expr", $._expression)
      ),

    if_expression: ($) =>
      prec.right(
        seq(
          "if",
          field("condition", $._simple_expression),
          field("then", $.block),
          field("else", optional(seq("else", choice($.if_expression, $.block))))
        )
      ),

    loop_expression: ($) => seq("loop", $.block),

    match_expression: ($) =>
      seq(
        "match",
        field("condition", $._expression),
        field("cases", $.match_cases)
      ),

    match_cases: ($) => seq("{", list($.match_case, ","), "}"),

    match_case: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field("pattern", $._match_case_pattern),
        "=>",
        field("value", $._expression)
      ),

    _match_case_pattern: ($) => choice($._pattern, $._literal_expression),

    call_expression: ($) =>
      prec(
        PREC.primary,
        seq(field("operand", $._expression), field("arguments", $.arguments))
      ),

    arguments: ($) => seq("(", list($.argument, ","), ")"),

    argument: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field("argument", choice($._expression, $.named_argument))
      ),

    named_argument: ($) => seq($.name, "=", $._expression),

    selector_expression: ($) =>
      seq(field("operand", $._expression), ".", field("field", $.name)),

    index_expression: ($) =>
      seq(
        field("operand", $._expression),
        "[",
        field("index", $._expression),
        "]"
      ),

    _literal_expression: ($) =>
      choice($.true, $.false, $.number, $.string, $.unit),

    // ******************************************
    // Attributes
    //
    // Example: #[derive(Eq)], #[test]
    // ******************************************
    attribute: ($) => seq("#", "[", repeat1($.attribute_value), "]"),

    attribute_value: ($) => seq($.path, optional($._attribute_arguments)),

    _attribute_arguments: ($) =>
      seq("(", list1($.attribute_argument, ","), ")"),

    attribute_argument: ($) =>
      choice(
        $.name,
        $._literal_expression,
        // Key - Value
        seq($.path, ":", $._literal_expression),
        // Key - Tuple of arguments
        seq($.path, ":", $._attribute_arguments)
      ),

    // ******************************************
    // Modifiers
    // ******************************************
    _modifier: ($) => choice($.modifier_ref, $.modifier_mut),

    modifier_ref: ($) => "ref",

    modifier_mut: ($) => "mut",

    // ******************************************
    // Names
    // ******************************************
    name: ($) => /[a-zA-Z][a-zA-Z0-9_]*/,

    qualified_name: ($) =>
      seq(
        repeat(seq($.qualified_name_segment, "::")),
        $.name,
        optional(seq("::", $.type_arguments))
      ),
    qualified_name_segment: ($) => seq($.name, optional($.type_arguments)),

    wildcard: ($) => "_",

    // ******************************************
    // Types
    // ******************************************
    _type: ($) => choice($.type_tuple, $.type_identifier),

    type_tuple: ($) => seq("(", list($._type, ","), ")"),

    type_identifier: ($) => seq($.qualified_name, optional($.type_arguments)),

    type_arguments: ($) => seq("<", list($.type_argument, ","), ">"),

    type_argument: ($) =>
      seq(
        field("attributes", repeat($.attribute)),
        field("parameter", choice($.qualified_name, $._literal_expression))
      ),

    // ******************************************
    // Patterns
    // ******************************************
    _pattern: ($) =>
      choice($._pattern_var, $.pattern_struct, $.pattern_enum, $.pattern_tuple),

    _pattern_var: ($) => choice($.wildcard, alias($.name, $.identifier)),

    pattern_struct: ($) =>
      seq($.qualified_name, "{", list1($._pattern_struct_binding, ","), "}"),

    _pattern_struct_binding: ($) =>
      choice($.name, seq($.name, ":", $._pattern)),

    pattern_enum: ($) =>
      seq($.qualified_name, "(", list1($._pattern, ","), ")"),

    pattern_tuple: ($) => seq("(", list1($._pattern, ","), ")"),

    // ******************************************
    // Literals
    // ******************************************
    true: ($) => "true",
    false: ($) => "false",
    number: ($) =>
      seq(
        field("value", choice($.integer, $.hex, $.octal, $.binary)),
        field("suffix", optional($._number_suffix))
      ),
    unit: ($) => token(seq("(", ")")),

    integer: ($) => /[0-9]+/,
    hex: ($) => /0x[0-9a-f]+/,
    octal: ($) => /0o[0-7]+/,
    binary: ($) => /0b[01]+/,
    _number_suffix: ($) => /_[a-z][a-z0-9]+/,

    string: ($) => token(seq("'", /[^']*/, "'")),

    // ******************************************
    // Extra
    // ******************************************

    comment: ($) => token(seq("//", /.*/, "\n")),
  },
});

function list(rule, separator) {
  return seq(repeat(seq(rule, separator)), optional(rule));
}

function list1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)), optional(separator));
}