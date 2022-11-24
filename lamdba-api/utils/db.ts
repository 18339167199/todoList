'use strict';

// @ts-ignore
import AWS from 'aws-sdk';
AWS.config.region = 'ap-southeast-1';

export const db = new AWS.DynamoDB.DocumentClient();
