var define = require('node-constants')(exports);

define({
	API_PREFIX: '/api',
	ALL_VERIFICATIONS: '/verifications',
	ASSET_VERIFICATION: '/asset/:epc_identifier/validation',
	CI_TYPE_REST_ENDPOINT: 'REST',
	ENTITY_TYPE_MANUFACTURER: 'MANUFACTURER',
	ENTITY_TYPE_VRS_PROVIER: 'VRS_PROVIDER',
	VERIFY_PRODUCT: '/productIdentifier',
	REQUESTING: 'Requesting',
	VERIFIED: 'Verified',
	NOT_VERIFIED: 'Not verified',
	PENDING: 'Pending',
	GET_VERIFICATION_BY_SRN: '/verification/:gtin/:srn',
	ERROR: 'Error',
	REQUEST_RECEIVED: 'Request received',
	REQUESTOR_VALIDATION: 'Requestor validation',
	PARSING_REQUEST: 'Parsing request',
	LOOKUP_CONTACTED: 'Contacted lookup',
	POSTED_TO_RESPONDER: 'Posted to responder',
	FORWARDED_TO_OTHER_VRS: 'Forwarded to other VRS'	,
	RESPONSE_RECEIVED: 'Response received',
	RESPONSE_DELIVERED: 'Response delivered',
	LOOKUP_FOUND: 'Lookup found',
	LOOKUP_NOT_FOUND: 'Lookup not found',
	REQUESTOR: 'Requestor',
	RESPONDER: 'Responder'
});

