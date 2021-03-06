/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const express = require('express');
const dataManager = require("./dataManager");

/************************************************************
  API Endpoints
 ************************************************************/
// Define the routes for the REST API
var admin = express.Router();
// methods that require multiple routes

/**
 * @swagger
 *
 *
 * definitions:
 *   SyncronizeResourcesType:
 *     type: string
 *     description: Syncronize Resources Type
 *     enum:
 *       - PERMISSIONS
 *       - VIEWS
 *       - ALL
 *
 *   SyncronizeResourcesRequest:
 *     type: object
 *     description: Syncronize Resources Request object
 *     properties:
 *       type:
 *         $ref: '#/definitions/SyncronizeResourcesType'
 *
 *   Error:
 *     type: object
 *     description: Error object
 *     properties:
 *       success:
 *         type: boolean
 *         description: Success of the request
 *       code:
 *         type: integer
 *         description: HTTP status code
 *       errors:
 *         type: array
 *         items:
 *           type: string
 *
 */

/**
 * @swagger
 *
 * /admin:initSchema:
 *   options:
 *     summary: CORS support
 *     description: Enable CORS by returning correct headers
 *     operationId: optionsInitSchema
 *     security: [] # no security for preflight requests
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Default response for CORS method
 *         headers:
 *           Access-Control-Allow-Headers:
 *             type: "string"
 *           Access-Control-Allow-Methods:
 *             type: "string"
 *           Access-Control-Allow-Origin:
 *             type: "string"
 *   post:
 *     summary: Initialize the Datashare schema creation
 *     description: Returns the schema creation response
 *     operationId: initSchema
 *     tags:
 *       - admin
 *     parameters:
 *     - in: header
 *       name: x-gcp-project-id
 *       type: string
 *       required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: initSchema response
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Success of the request
 *             code:
 *               type: integer
 *               description: HTTP status code
 *             data:
 *               type: object
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
/**
 * @swagger
 *
 * /admin:syncResources:
 *   options:
 *     summary: CORS support
 *     description: Enable CORS by returning correct headers
 *     operationId: optionsSyncResources
 *     security: [] # no security for preflight requests
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Default response for CORS method
 *         headers:
 *           Access-Control-Allow-Headers:
 *             type: "string"
 *           Access-Control-Allow-Methods:
 *             type: "string"
 *           Access-Control-Allow-Origin:
 *             type: "string"
 *   post:
 *     summary: Syncronize the Datashare resources and metadata
 *     description: Returns the syncronize resources response
 *     operationId: syncResources
 *     tags:
 *       - admin
 *     parameters:
 *     - in: header
 *       name: x-gcp-project-id
 *       type: string
 *       required: true
 *     - in: body
 *       name: syncronize_resources
 *       description: Request parameters for Syncronize Resources
 *       schema:
 *         $ref: '#/definitions/SyncronizeResourcesRequest'
 *       required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Syncronize resources response
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Success of the request
 *             code:
 *               type: integer
 *               description: HTTP status code
 *             data:
 *               type: object
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
admin.post('/admin::custom', async (req, res) => {
    const projectId = req.header('x-gcp-project-id');
    let data;
    let code;

    switch (req.params.custom) {
        case "initSchema": {
            data = await dataManager.initializeSchema(projectId);
            if (data && data.success === false) {
                code = (data.code === undefined) ? 500 : data.code;
            } else {
                code = (data.code === undefined) ? 200 : data.code;
            }
            return res.status(code).json({
                code: code,
                ...data
            });
        }
        case "syncResources": {
            const syncType = req.body.type;
            if (!syncType) {
                return res.status(400).json({
                    success: false,
                    code: 400,
                    errors: ['sync type parameter(s) are required']
                });
            }
            data = await dataManager.syncResources(projectId, syncType);
            if (data && data.success === false) {
                code = (data.code === undefined) ? 500 : data.code;
            } else {
                code = (data.code === undefined) ? 200 : data.code;
            }
            return res.status(code).json({
                code: code,
                ...data
            });
        }
    }
});

module.exports = admin;
