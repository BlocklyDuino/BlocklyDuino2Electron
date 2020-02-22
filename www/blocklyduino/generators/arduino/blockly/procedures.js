/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Arduino.procedures');

goog.require('Blockly.Arduino');


Blockly.Arduino['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Arduino.statementToCode(block, 'STACK');
  if (Blockly.Arduino.STATEMENT_PREFIX) {
    var id = block.id.replace(/\$/g, '$$$$');  // Issue 251.
    branch = Blockly.Arduino.prefixLines(
        Blockly.Arduino.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + id + '\''), Blockly.Arduino.INDENT) + branch;
  }
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.Arduino.valueToCode(block, 'RETURN',
      Blockly.Arduino.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = Blockly.Arduino.INDENT + 'return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'int' : 'void';
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = 'int ' + Blockly.Arduino.variableDB_.getName(block.arguments_[i],
        Blockly.Variables.NAME_TYPE);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}\n';
  code = Blockly.Arduino.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Arduino.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Arduino['procedures_defnoreturn'] =
    Blockly.Arduino['procedures_defreturn'];

Blockly.Arduino['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Arduino.valueToCode(block, 'ARG' + i,
        Blockly.Arduino.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Arduino.valueToCode(block, 'ARG' + i,
        Blockly.Arduino.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.Arduino['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Arduino.valueToCode(block, 'CONDITION',
      Blockly.Arduino.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.Arduino.valueToCode(block, 'VALUE',
        Blockly.Arduino.ORDER_NONE) || 'null';
    code += Blockly.Arduino.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.Arduino.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
