function addParameter()
{
	var lastrow_elem = document.getElementById('lastrow');
	var index = 0;
	for (var i = 0; i < 5; ++i)
	{
		if (document.getElementById('param' + i + '_type'))
		{
			index += 1;
		}
	}
	lastrow.insertAdjacentHTML('beforebegin', `<tr id="row${index}"><td class="labels"><label for="param${index}_type">Parameter ${index+1}</label></td><td><input type="text" id="param${index}_type" name="param${index}_type" placeholder="type" onInput="refreshDelegateForm();" required></td><td><input type="text" id="param${index}_name" name="param${index}_name" placeholder="name" onInput="refreshDelegateForm();" required></td><td><input type="button" id="param${index}_button" name="param${index}_button" value="X" onClick="deleteParameter(${index});"></td></tr>`);
	refreshDelegateForm();
	return;
}

function deleteParameter(param_index)
{
	var row_elem = document.getElementById('row' + param_index);
	if (row_elem)
	{
		row_elem.parentNode.removeChild(row_elem);
	}
	refreshDelegateForm();
	return;
}

function refreshDelegateForm()
{
	var is_dynamic = document.getElementById('dynamic').checked;
	var dynamic_str = is_dynamic ? "_<span class=\"dynamic\">DYNAMIC</span>" : "";
	var is_multicast = document.getElementById('multicast').checked;
	var multicast_str = is_multicast ? "_<span class=\"multicast\">MULTICAST</span>" : "";
	var delegate_name = document.getElementById('delegate_name').value;

	var ret = "";
	if (is_multicast)
	{
		document.getElementById('returntype').placeholder = "(Multicast delegates cannot have return types)";
		document.getElementById('returntype').disabled = true;
	}
	else
	{
		document.getElementById('returntype').placeholder = "void";
		document.getElementById('returntype').disabled = false;
		ret = document.getElementById('returntype').value;
	}
	
	// get all the parameters
	var max_params = 6;
	var parameters = [];
	var valid_param_count = 0;
	var param_count = 0;
	for (var i = 0; i <= max_params; ++i)
	{
		if (document.getElementById('param' + i + '_type'))
		{
			var param_type = document.getElementById('param' + i + '_type').value;
			var param_name = document.getElementById('param' + i + '_name').value;
			if (param_type != '' && param_name != '')
			{
				parameters.push([ param_type, param_name ]);
				valid_param_count += 1;
			}
			param_count += 1;
		}
	}
	
	document.getElementById('add_param_button').disabled = param_count >= max_params;
	
	var params = "";
	if (valid_param_count == 1)
	{
		params = "_<span class=\"params\">OneParam</span>";
	}
	else if (valid_param_count == 2)
	{
		params = "_<span class=\"params\">TwoParams</span>";
	}
	else if (valid_param_count == 3)
	{
		params = "_<span class=\"params\">ThreeParams</span>";
	}
	else if (valid_param_count == 4)
	{
		params = "_<span class=\"params\">FourParams</span>";
	}
	else if (valid_param_count == 5)
	{
		params = "_FiveParams";
	}
	else if (valid_param_count == 6)
	{
		params = "_SixParams";
	}
	
	var delegate_name = document.getElementById('delegate_name').value;
	
	var delegate_parameters_arr = [];
	var retval = "";
	var function_retval = "void";
	if (ret != "")
	{
		retval = "_<span class=\"retval\">RetVal</span>";
		function_retval = ret;
		delegate_parameters_arr.push("<span class=\"retval\">" + ret + "</span>");
	}
	if (is_multicast)
	{
		retval = "";
	}
	
	delegate_parameters_arr.push("F<span class=\"delegatename\">" + delegate_name + "</span>Signature");
	
	// delegate stuff
	for (var i = 0; i < valid_param_count; ++i)
	{
		if (is_dynamic)
		{
			delegate_parameters_arr.push("<span class=\"params\">" + parameters[i][0] + ", " + parameters[i][1] + "</span>");
		}
		else
		{
			delegate_parameters_arr.push("<span class=\"params\">" + parameters[i][0] + "</span> <span class=\"cm\">/* " + parameters[i][1] + " */</span>");
		}
	}
	var delegate_parameters_str = delegate_parameters_arr.join(", ");
	
	// function stuff
	var function_parameters_arr = [];
	for (var i = 0; i < valid_param_count; ++i)
	{
		function_parameters_arr.push(parameters[i][0] + " " + parameters[i][1]);
	}
	var function_parameters_str = function_parameters_arr.join(", ");
	
	
	var delegate_signature = "DECLARE" + dynamic_str + multicast_str + "_DELEGATE" + retval + params + "(" + delegate_parameters_str + ");";
	
	var function_signature = "<span class=\"retval\">" + function_retval + "</span> <span class=\"delegatename\">" + delegate_name + "</span>(" + function_parameters_str + ");";
	
	document.getElementById('delegate_signature').innerHTML = delegate_signature;
	document.getElementById('function_signature').innerHTML = function_signature;
	return;
}

