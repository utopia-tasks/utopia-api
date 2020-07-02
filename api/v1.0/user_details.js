let userDetails = {};

userDetails.create = function (result) {
	this.firstName = result['first_name'];
	this.lastName = result['last_name'];
	this.email = result['email'];
	this.language = result['language'];
	this.offsetHours = result['offset_hours'];
	this.createdAt = result['created_at'];
	this.updatedAt = result['updated_at'];
	return this;
};

module.exports = userDetails;