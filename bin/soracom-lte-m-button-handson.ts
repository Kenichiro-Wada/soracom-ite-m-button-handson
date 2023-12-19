#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SoracomLteMButtonHandsonStack } from '../lib/soracom-lte-m-button-handson-stack';

const app = new cdk.App();
new SoracomLteMButtonHandsonStack(app, 'SoracomLteMButtonHandsonStack', {
});