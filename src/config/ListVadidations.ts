import _ from "lodash";
import validatorHook from "@src/hooks/ValidatorHook";
let { mail,extensionDraggerImageSP,limitDraggerImage,limitSizeImageDraggerSP } = validatorHook();

export const validations = ({name,validation,t,arrType=[],validationSizeFileUpload = 10,validationNumberFileUpload = 1}) => {

	switch (validation) {
		case 'required':
			return ({ required: true, message: t('messages:form.required', { name: name }) })
		case 'whitespace':
			return ({ whitespace: true, message: t('messages:form.required', { name: name }) })
		case 'email' :
			return	mail({message:t("messages:form.email")})
		case 'type_file_upload' :
			return extensionDraggerImageSP(t('messages:form.extensionImgNotValid'), arrType)
		case 'number_file_upload' :
			return limitDraggerImage(t('messages:form.limitImage', { limit: validationNumberFileUpload }), validationNumberFileUpload)
		case 'size_file_upload' :
			return limitSizeImageDraggerSP(t('messages:form.ImgUploadIsTooBig', { max: validationSizeFileUpload }),validationSizeFileUpload)
	}
};
