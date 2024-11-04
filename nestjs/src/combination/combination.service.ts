import { Injectable } from '@nestjs/common';
import { CreateCombinationDto } from './dto/create-combination.dto';
import * as mysql from 'mysql2/promise';
import { dbConfig } from '../dbConfig';

@Injectable()
export class CombinationService {
  constructor() {}

  /** generate */
  async generate(dto: CreateCombinationDto) {
    const arr = this.transformArray(dto.numbers);
    const combinations = this.generateValidCombinations(arr, dto.length);
    const connection = await mysql.createConnection(dbConfig);
    try {
      await connection.beginTransaction(); // Start transaction

      // Prepare results to store into database
      const combinationResults = [];
      for (const combination of combinations) {
        const [result]: any = await connection.execute(
          'INSERT INTO combinations (combination) VALUES (?)',
          [JSON.stringify(combination)],
        );
        combinationResults.push({ id: result.insertId, combination });
      }

      // Get the last response ID
      const [lastResponse] = await connection.execute(
        'SELECT MAX(id) AS maxId FROM responses',
      );

      // Determine the new response ID
      const newResponseId = (lastResponse[0].maxId || 0) + 1; // Start at 1 if no responses exist

      // Store response in the database
      const response = {
        id: newResponseId,
        combination: combinationResults.map((res) => res.combination),
      };

      await connection.execute('INSERT INTO responses (response) VALUES (?)', [
        JSON.stringify(response),
      ]);

      await connection.commit();
      return response;
    } catch (error) {
      await connection.rollback();
      console.error('Transaction failed:', error);
      throw new Error('Database operation failed');
    } finally {
      await connection.end();
    }
  }

  /** Transform array numbers to alphabet */
  transformArray(numbers) {
    let arr = [];
    let result = [];
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    numbers.forEach((num, index) => {
      let letter = alphabet[index];
      for (let i = 1; i <= num; i++) {
        result.push(`${letter}${i}`);
      }
    });
    arr.push(result);
    return arr;
  }

  /** Recursively generate valid combinations */
  generateValidCombinations(arr, length = 2) {
    function getCombinations(
      currentArr,
      comboLength,
      currentCombo = [],
      start = 0,
    ) {
      if (currentCombo.length === comboLength) {
        return [currentCombo];
      }

      let result = [];
      for (let i = start; i < currentArr.length; i++) {
        const newCombo = currentCombo.concat(currentArr[i]);
        result = result.concat(
          getCombinations(currentArr, comboLength, newCombo, i + 1),
        );
      }
      return result;
    }

    // Get all combinations of the specified length
    const allCombinations = getCombinations(arr[0], length);

    // Filter combinations to ensure each element starts with a unique letter
    const validCombinations = allCombinations.filter((combo) => {
      const initials = combo.map((item) => item[0]);
      return new Set(initials).size === combo.length;
    });

    return validCombinations;
  }
}
