**source_file:**

![source_file](resources/diagram/source_file.svg)

```
source_file
         ::= _declaration*
```

**_declaration:**

![_declaration](resources/diagram/_declaration.svg)

```
_declaration
         ::= import_declaration
           | module_declaration
           | typealias_declaration
           | const_declaration
           | trait_declaration
           | struct_declaration
           | enum_declaration
           | _impl_declaration
           | function_declaration
```

referenced by:

* impl_body
* module_body
* source_file

**path:**

![path](resources/diagram/path.svg)

```
path     ::= name ( '::' name )* '::'?
```

referenced by:

* attribute_argument
* attribute_value
* import_declaration

**module_declaration:**

![module_declaration](resources/diagram/module_declaration.svg)

```
module_declaration
         ::= attribute* 'mod' name ( ';' | module_body )
```

referenced by:

* _declaration

**module_body:**

![module_body](resources/diagram/module_body.svg)

```
module_body
         ::= '{' _declaration* '}'
```

referenced by:

* module_declaration

**import_declaration:**

![import_declaration](resources/diagram/import_declaration.svg)

```
import_declaration
         ::= attribute* 'use' path ( 'as' name )? ';'
```

referenced by:

* _declaration

**const_declaration:**

![const_declaration](resources/diagram/const_declaration.svg)

```
const_declaration
         ::= attribute* 'const' name ':' _type '=' _expression ';'
```

referenced by:

* _declaration

**typealias_declaration:**

![typealias_declaration](resources/diagram/typealias_declaration.svg)

```
typealias_declaration
         ::= attribute* 'type' name type_parameters? '=' _type ';'
```

referenced by:

* _declaration

**trait_declaration:**

![trait_declaration](resources/diagram/trait_declaration.svg)

```
trait_declaration
         ::= attribute* 'trait' name type_parameters? trait_body
```

referenced by:

* _declaration

**trait_body:**

![trait_body](resources/diagram/trait_body.svg)

```
trait_body
         ::= '{' trait_function* '}'
```

referenced by:

* trait_declaration

**trait_function:**

![trait_function](resources/diagram/trait_function.svg)

```
trait_function
         ::= function_signature ';'
```

referenced by:

* trait_body

**struct_declaration:**

![struct_declaration](resources/diagram/struct_declaration.svg)

```
struct_declaration
         ::= attribute* 'struct' name type_parameters? ( member_declarations | ';' )
```

referenced by:

* _declaration

**enum_declaration:**

![enum_declaration](resources/diagram/enum_declaration.svg)

```
enum_declaration
         ::= attribute* 'enum' name type_parameters? member_declarations
```

referenced by:

* _declaration

**member_declarations:**

![member_declarations](resources/diagram/member_declarations.svg)

```
member_declarations
         ::= '{' ( member_declaration ',' )* member_declaration? '}'
```

referenced by:

* enum_declaration
* struct_declaration

**member_declaration:**

![member_declaration](resources/diagram/member_declaration.svg)

```
member_declaration
         ::= attribute* name ':' _type
```

referenced by:

* member_declarations

**_impl_declaration:**

![_impl_declaration](resources/diagram/_impl_declaration.svg)

```
_impl_declaration
         ::= impl_base
           | impl_trait
```

referenced by:

* _declaration

**impl_base:**

![impl_base](resources/diagram/impl_base.svg)

```
impl_base
         ::= attribute* 'impl' name type_parameters? impl_body
```

referenced by:

* _impl_declaration

**impl_trait:**

![impl_trait](resources/diagram/impl_trait.svg)

```
impl_trait
         ::= attribute* 'impl' name type_parameters? 'of' qualified_name impl_body
```

referenced by:

* _impl_declaration

**impl_body:**

![impl_body](resources/diagram/impl_body.svg)

```
impl_body
         ::= '{' _declaration* '}'
```

referenced by:

* impl_base
* impl_trait

**function_declaration:**

![function_declaration](resources/diagram/function_declaration.svg)

```
function_declaration
         ::= function_signature block
```

referenced by:

* _declaration

**function_signature:**

![function_signature](resources/diagram/function_signature.svg)

```
function_signature
         ::= attribute* 'fn' name type_parameters? parameters ( '->' _type )?
```

referenced by:

* function_declaration
* trait_function

**parameters:**

![parameters](resources/diagram/parameters.svg)

```
parameters
         ::= '(' ( parameter ',' )* parameter? ')'
```

referenced by:

* function_signature

**parameter:**

![parameter](resources/diagram/parameter.svg)

```
parameter
         ::= attribute* _modifier* name ':' _type
```

referenced by:

* parameters

**type_parameters:**

![type_parameters](resources/diagram/type_parameters.svg)

```
type_parameters
         ::= '<' _type_parameter ( ',' _type_parameter )* ','? '>'
```

referenced by:

* enum_declaration
* function_signature
* impl_base
* impl_trait
* struct_declaration
* trait_declaration
* typealias_declaration

**_type_parameter:**

![_type_parameter](resources/diagram/_type_parameter.svg)

```
_type_parameter
         ::= attribute* ( name | type_parameter_const | type_parameter_impl )
```

referenced by:

* type_parameters

**type_parameter_const:**

![type_parameter_const](resources/diagram/type_parameter_const.svg)

```
type_parameter_const
         ::= 'const' name ':' _type
```

referenced by:

* _type_parameter

**type_parameter_impl:**

![type_parameter_impl](resources/diagram/type_parameter_impl.svg)

```
type_parameter_impl
         ::= 'impl' name ':' _type
```

referenced by:

* _type_parameter

**block:**

![block](resources/diagram/block.svg)

```
block    ::= '{' statement* tail_expression? '}'
```

referenced by:

* _expression
* function_declaration
* if_expression
* loop_expression

**tail_expression:**

![tail_expression](resources/diagram/tail_expression.svg)

```
tail_expression
         ::= attribute* _expression
```

referenced by:

* block

**statement:**

![statement](resources/diagram/statement.svg)

```
statement
         ::= attribute* ( let_statement | assignment_statement | return_statement | break_statement | if_expression | loop_expression | match_expression | _expression ';' )
```

referenced by:

* block

**let_statement:**

![let_statement](resources/diagram/let_statement.svg)

```
let_statement
         ::= 'let' 'mut'? _pattern ( ':' _type )? '=' _expression ';'
```

referenced by:

* statement

**assignment_statement:**

![assignment_statement](resources/diagram/assignment_statement.svg)

```
assignment_statement
         ::= ( name | '_' ) ( '*=' | '/=' | '%=' | '+=' | '-=' | '=' ) _expression ';'
```

referenced by:

* statement

**return_statement:**

![return_statement](resources/diagram/return_statement.svg)

```
return_statement
         ::= 'return' _expression? ';'
```

referenced by:

* statement

**break_statement:**

![break_statement](resources/diagram/break_statement.svg)

```
break_statement
         ::= 'break' _expression? ';'
```

referenced by:

* statement

**_expression:**

![_expression](resources/diagram/_expression.svg)

```
_expression
         ::= tuple_expressions
           | block
           | unary_expression
           | binary_expression
           | if_expression
           | loop_expression
           | match_expression
           | selector_expression
           | index_expression
           | call_expression
           | qualified_name
           | _literal_expression
```

referenced by:

* argument
* assignment_statement
* binary_expression
* break_statement
* call_expression
* const_declaration
* index_expression
* let_statement
* match_case
* match_expression
* named_argument
* return_statement
* selector_expression
* statement
* tail_expression
* tuple_expression
* unary_expression

**_simple_expression:**

![_simple_expression](resources/diagram/_simple_expression.svg)

```
_simple_expression
         ::= tuple_expressions
           | unary_expression
           | binary_expression
           | if_expression
           | loop_expression
           | match_expression
           | selector_expression
           | index_expression
           | call_expression
           | qualified_name
           | _literal_expression
```

referenced by:

* if_expression

**unary_expression:**

![unary_expression](resources/diagram/unary_expression.svg)

```
unary_expression
         ::= ( '!' | '*' | '-' | '@' ) _expression
```

referenced by:

* _expression
* _simple_expression

**binary_expression:**

![binary_expression](resources/diagram/binary_expression.svg)

```
binary_expression
         ::= _expression ( '*' | '/' | '%' | '+' | '-' | '==' | '!=' | '<' | '<=' | '>' | '>=' | '&' | '|'
                  ) _expression
```

referenced by:

* _expression
* _simple_expression

**tuple_expressions:**

![tuple_expressions](resources/diagram/tuple_expressions.svg)

```
tuple_expressions
         ::= '(' tuple_expression ( ',' tuple_expression )* ','? ')'
```

referenced by:

* _expression
* _simple_expression

**tuple_expression:**

![tuple_expression](resources/diagram/tuple_expression.svg)

```
tuple_expression
         ::= attribute? _expression
```

referenced by:

* tuple_expressions

**if_expression:**

![if_expression](resources/diagram/if_expression.svg)

```
if_expression
         ::= 'if' _simple_expression block ( 'else' 'if' _simple_expression block )* ( 'else' block )?
```

referenced by:

* _expression
* _simple_expression
* statement

**loop_expression:**

![loop_expression](resources/diagram/loop_expression.svg)

```
loop_expression
         ::= 'loop' block
```

referenced by:

* _expression
* _simple_expression
* statement

**match_expression:**

![match_expression](resources/diagram/match_expression.svg)

```
match_expression
         ::= 'match' _expression match_cases
```

referenced by:

* _expression
* _simple_expression
* statement

**match_cases:**

![match_cases](resources/diagram/match_cases.svg)

```
match_cases
         ::= '{' ( match_case ',' )* match_case? '}'
```

referenced by:

* match_expression

**match_case:**

![match_case](resources/diagram/match_case.svg)

```
match_case
         ::= attribute* _match_case_pattern '=>' _expression
```

referenced by:

* match_cases

**_match_case_pattern:**

![_match_case_pattern](resources/diagram/_match_case_pattern.svg)

```
_match_case_pattern
         ::= _pattern
           | _literal_expression
```

referenced by:

* match_case

**call_expression:**

![call_expression](resources/diagram/call_expression.svg)

```
call_expression
         ::= _expression arguments
```

referenced by:

* _expression
* _simple_expression

**arguments:**

![arguments](resources/diagram/arguments.svg)

```
arguments
         ::= '(' ( argument ',' )* argument? ')'
```

referenced by:

* call_expression

**argument:**

![argument](resources/diagram/argument.svg)

```
argument ::= attribute* ( _expression | named_argument )
```

referenced by:

* arguments

**named_argument:**

![named_argument](resources/diagram/named_argument.svg)

```
named_argument
         ::= name '=' _expression
```

referenced by:

* argument

**selector_expression:**

![selector_expression](resources/diagram/selector_expression.svg)

```
selector_expression
         ::= _expression '.' name
```

referenced by:

* _expression
* _simple_expression

**index_expression:**

![index_expression](resources/diagram/index_expression.svg)

```
index_expression
         ::= _expression '[' _expression ']'
```

referenced by:

* _expression
* _simple_expression

**_literal_expression:**

![_literal_expression](resources/diagram/_literal_expression.svg)

```
_literal_expression
         ::= 'true'
           | 'false'
           | number
           | string
           | unit
```

referenced by:

* _expression
* _match_case_pattern
* _simple_expression
* attribute_argument
* type_argument

**attribute:**

![attribute](resources/diagram/attribute.svg)

```
attribute
         ::= '#' '[' attribute_value+ ']'
```

referenced by:

* _type_parameter
* argument
* const_declaration
* enum_declaration
* function_signature
* impl_base
* impl_trait
* import_declaration
* match_case
* member_declaration
* module_declaration
* parameter
* statement
* struct_declaration
* tail_expression
* trait_declaration
* tuple_expression
* type_argument
* typealias_declaration

**attribute_value:**

![attribute_value](resources/diagram/attribute_value.svg)

```
attribute_value
         ::= path _attribute_arguments?
```

referenced by:

* attribute

**_attribute_arguments:**

![_attribute_arguments](resources/diagram/_attribute_arguments.svg)

```
_attribute_arguments
         ::= '(' attribute_argument ( ',' attribute_argument )* ','? ')'
```

referenced by:

* attribute_argument
* attribute_value

**attribute_argument:**

![attribute_argument](resources/diagram/attribute_argument.svg)

```
attribute_argument
         ::= name
           | _literal_expression
           | path ':' ( _literal_expression | _attribute_arguments )
```

referenced by:

* _attribute_arguments

**_modifier:**

![_modifier](resources/diagram/_modifier.svg)

```
_modifier
         ::= 'ref'
           | 'mut'
```

referenced by:

* parameter

**name:**

![name](resources/diagram/name.svg)

```
name     ::= [a-zA-Z] [a-zA-Z0-9_]*
```

referenced by:

* _pattern_struct_binding
* _pattern_var
* _type_parameter
* assignment_statement
* attribute_argument
* const_declaration
* enum_declaration
* function_signature
* impl_base
* impl_trait
* import_declaration
* member_declaration
* module_declaration
* named_argument
* parameter
* path
* qualified_name
* qualified_name_segment
* selector_expression
* struct_declaration
* trait_declaration
* type_parameter_const
* type_parameter_impl
* typealias_declaration

**qualified_name:**

![qualified_name](resources/diagram/qualified_name.svg)

```
qualified_name
         ::= ( qualified_name_segment '::' )* name ( '::' type_arguments )?
```

referenced by:

* _expression
* _simple_expression
* impl_trait
* pattern_enum
* pattern_struct
* type_argument
* type_identifier

**qualified_name_segment:**

![qualified_name_segment](resources/diagram/qualified_name_segment.svg)

```
qualified_name_segment
         ::= name type_arguments?
```

referenced by:

* qualified_name

**_type:**

![_type](resources/diagram/_type.svg)

```
_type    ::= type_tuple
           | type_identifier
           | '_'
           | type_snapshot
```

referenced by:

* const_declaration
* function_signature
* let_statement
* member_declaration
* parameter
* type_parameter_const
* type_parameter_impl
* type_snapshot
* type_tuple
* typealias_declaration

**type_tuple:**

![type_tuple](resources/diagram/type_tuple.svg)

```
type_tuple
         ::= '(' ( _type ',' )* _type? ')'
```

referenced by:

* _type

**type_snapshot:**

![type_snapshot](resources/diagram/type_snapshot.svg)

```
type_snapshot
         ::= '@' _type
```

referenced by:

* _type

**type_identifier:**

![type_identifier](resources/diagram/type_identifier.svg)

```
type_identifier
         ::= qualified_name type_arguments?
```

referenced by:

* _type

**type_arguments:**

![type_arguments](resources/diagram/type_arguments.svg)

```
type_arguments
         ::= '<' ( type_argument ',' )* type_argument? '>'
```

referenced by:

* qualified_name
* qualified_name_segment
* type_identifier

**type_argument:**

![type_argument](resources/diagram/type_argument.svg)

```
type_argument
         ::= attribute* ( qualified_name | _literal_expression )
```

referenced by:

* type_arguments

**_pattern:**

![_pattern](resources/diagram/_pattern.svg)

```
_pattern ::= _pattern_var
           | pattern_struct
           | pattern_enum
           | pattern_tuple
```

referenced by:

* _match_case_pattern
* _pattern_struct_binding
* let_statement
* pattern_enum
* pattern_tuple

**_pattern_var:**

![_pattern_var](resources/diagram/_pattern_var.svg)

```
_pattern_var
         ::= '_'
           | name
```

referenced by:

* _pattern

**pattern_struct:**

![pattern_struct](resources/diagram/pattern_struct.svg)

```
pattern_struct
         ::= qualified_name '{' _pattern_struct_binding ( ',' _pattern_struct_binding )* ','? '}'
```

referenced by:

* _pattern

**_pattern_struct_binding:**

![_pattern_struct_binding](resources/diagram/_pattern_struct_binding.svg)

```
_pattern_struct_binding
         ::= name ( ':' _pattern )?
```

referenced by:

* pattern_struct

**pattern_enum:**

![pattern_enum](resources/diagram/pattern_enum.svg)

```
pattern_enum
         ::= qualified_name '(' _pattern ( ',' _pattern )* ','? ')'
```

referenced by:

* _pattern

**pattern_tuple:**

![pattern_tuple](resources/diagram/pattern_tuple.svg)

```
pattern_tuple
         ::= '(' _pattern ( ',' _pattern )* ','? ')'
```

referenced by:

* _pattern

**number:**

![number](resources/diagram/number.svg)

```
number   ::= ( integer | hex | octal | binary ) _number_suffix?
```

referenced by:

* _literal_expression

**unit:**

![unit](resources/diagram/unit.svg)

```
unit     ::= '(' ')'
```

referenced by:

* _literal_expression

**integer:**

![integer](resources/diagram/integer.svg)

```
integer  ::= [0-9]+
```

referenced by:

* number

**hex:**

![hex](resources/diagram/hex.svg)

```
hex      ::= '0x' [0-9a-f]+
```

referenced by:

* number

**octal:**

![octal](resources/diagram/octal.svg)

```
octal    ::= '0o' [0-7]+
```

referenced by:

* number

**binary:**

![binary](resources/diagram/binary.svg)

```
binary   ::= '0b' [0-1]+
```

referenced by:

* number

**_number_suffix:**

![_number_suffix](resources/diagram/_number_suffix.svg)

```
_number_suffix
         ::= '_' [a-z] [a-z0-9]+
```

referenced by:

* number

**string:**

![string](resources/diagram/string.svg)

```
string   ::= "'" [^']* "'"
```

referenced by:

* _literal_expression

**comment:**

![comment](resources/diagram/comment.svg)

```
comment  ::= '//' '.'* '\n'
```

## 
![Railroad-Diagram-Generator](resources/diagram/Railroad-Diagram-Generator.svg) <sup>generated by [RR - Railroad Diagram Generator][RR]</sup>

[RR]: http://bottlecaps.de/rr/ui