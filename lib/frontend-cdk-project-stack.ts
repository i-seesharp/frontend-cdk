import * as cdk from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, RedirectProtocol } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FrontendCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'FrontendCdkProjectQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const primaryBucket: Bucket = new Bucket(this, 'testing-a-react-app-primary-bucket', {
      bucketName: 'www.testingareactapp.net',
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })

    const secondaryBucket: Bucket = new Bucket(this, 'testing-a-react-app-secondary-bucket', {
      bucketName: 'testingareactapp.net',
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      websiteRedirect: {
        hostName: 'www.testingareactapp.net',
        protocol: RedirectProtocol.HTTP,
      }
    })

    const zone = HostedZone.fromLookup(this, 'hosted-zone', {
      domainName: 'testingareactapp.net',
    })

    const acmCertificate = new Certificate(this, 'ACMCertificate', {
      certificateName: 'Testing-A-React-App-Certificate',
      domainName: 'www.testingareactapp.net',
      subjectAlternativeNames: ['testingareactapp.net'],
      validation: CertificateValidation.fromDns(zone),
    })

    const primaryDistribution = new Distribution(this, 'testing-react-app-primary-dist', {
      defaultBehavior: {
        origin: new S3Origin(primaryBucket),
      },
      certificate: acmCertificate,
      domainNames: ['www.testingareactapp.net', 'testingareactapp.net'],
      enabled: true,
    })
    primaryDistribution.node.addDependency(acmCertificate);

    const primaryARecord = new ARecord(this, 'primary-a-record', {
      zone,
      recordName: 'www',
      target: RecordTarget.fromAlias(new targets.CloudFrontTarget(primaryDistribution)),
    })
    primaryARecord.node.addDependency(primaryDistribution);

    const secondaryARecord = new ARecord(this, 'secondary-a-record', {
      zone,
      target: RecordTarget.fromAlias(new targets.CloudFrontTarget(primaryDistribution)),
    })
    secondaryARecord.node.addDependency(primaryDistribution);

    new BucketDeployment(this, 'testing-a-react-app-deployment', {
      sources: [Source.asset(path.join(__dirname, '../src/testing-react-app/dist'))],
      destinationBucket: primaryBucket,
      distribution: primaryDistribution,
      distributionPaths: ['/**/*'],
    })
  }
}
