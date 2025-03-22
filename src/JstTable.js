class JstTable {
	
	#id;
	#table;
	
	#filterBy = -1;
	
	#sort = 'desc';
	#lastSortedIcon = null;
	#lastSortedCol = null;
	
	constructor(id) {
		this.#id = id;
		this.#table = $(`#${id}`);
		
		this.#hookFilterListener();
		this.#loadFilter();
		
		this.#hookSortListener();
	}
	
	#hookSortListener() {
		let thisObj = this;
		
		/*
		 * Add click listener to sort icons found in table header
		 * */
		$(`#${this.#id} .jst-table-col-icon-sort`).click(function () {
			thisObj.#lastSortedIcon = this;
			
			// Toggle the sort direction
			thisObj.#sort = thisObj.#sort === 'asc' ? 'desc' : 'asc';
			
			/*
			 * Update sort icon UI
			 * */
			let angle = thisObj.#sort === 'desc' ? 'rotate(0deg) scaleX(1)' : 'rotate(180deg) scaleX(-1)';
			$(this).css('transform', angle);
			
			/*
			 * Remove all shown sort icons
			 * */
			let parent = this.parentElement;
			$(parent).toggleClass('jst-table-col-icon-sort-show', true);
			
			if (thisObj.#lastSortedCol !== parent) {
				$(thisObj.#lastSortedCol).removeClass('jst-table-col-icon-sort-show');
			}
			
			// Update the last sorted col
			thisObj.#lastSortedCol = parent;
			
			/*
			 * Sort the table rows
			 * */
			let rows = thisObj.#table.find('tbody tr').toArray();
			let index = $(parent).index();
			let descending = thisObj.#sort !== 'asc';
			
			rows.sort(function(rowA, rowB) {
				let cellA = $(rowA).children('td').eq(index).text().trim();
				let cellB = $(rowB).children('td').eq(index).text().trim();
				
				/*
				 * Oh, you number!
				 * */
				if (['৳', '£', '$'].includes(cellA[0])) {
					cellA = cellA.replace(/[৳£$,]/g, '');
				}
				
				if (['৳', '£', '$'].includes(cellB[0])) {
					cellB = cellB.replace(/[৳£$,]/g, '');
				}
				
				if ($.isNumeric(cellA) && $.isNumeric(cellB)) {
					return descending ? cellB - cellA : cellA - cellB;
				}
				
				return descending ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
			});
			
			// Append the sorted rows to the table
			$.each(rows, function(index, row) {
				thisObj.#table.children('tbody').append(row);
			});
		});
	}
	
	/*
	 * For a column name, it figures out the index of the column in table
	 * header. Returns -1 if it couldn't find the column in the table header.
	 * */
	#getColumnIndex(colName) {
		let colIndex = -1;
		
		$(`#${this.#id} th .jst-table-col-label`).each(function (i) {
			if ($(this).text().toLowerCase().trim() === colName.trim().toLowerCase()) {
				colIndex = i;
				return false;
			}
		});
		
		return colIndex;
	}
	
	#loadFilter() {
		let cachedFilter = localStorage.getItem(`jst_tab_filter_by_${this.#id}`) ?? null;
		$(`#${this.#id}-filter input`).prop('disabled', !cachedFilter);
		
		if (!cachedFilter) return;
		
		this.#filterBy = this.#getColumnIndex(cachedFilter);
		
		if (this.#filterBy === -1) return;
		
		/*
		 * Find the option if available in the select by the cached value
		 * */
		let options = $(`#${this.#id}-filter select option`).filter(function () {
			return $(this).val().toLowerCase() === cachedFilter;
		});
		
		if (options.length <= 0) return;
		
		$(`#${this.#id}-filter select`).val(options.val());
	}
	
	#hookFilterListener() {
		let filterDiv = `#${this.#id}-filter`;
		let keywordInput = $(`${filterDiv} input`);
		
		let thisObj = this;
		
		/*
		 * Add select option change listener
		 * */
		$(`${filterDiv} select`).change((i) => {
			/*
			 * Get the selected option value and disable input box if empty/undefined
			 * */
			let colName = i.target.value?.toLowerCase().trim();
			keywordInput.prop('disabled', !colName);
			
			/*
			 * Get the column index
			 * */
			this.#filterBy = this.#getColumnIndex(colName);
			
			/*
			 * TODO - Do we need to allow it via configuration option?
			 * */
			// if (this.#filterBy === -1) return;
			
			// Cache the option selected
			localStorage.setItem(`jst_tab_filter_by_${this.#id}`, colName);
		});
		
		/*
		 * Add keyup listener to filter input box
		 * */
		keywordInput.keyup(function () {
			let column = thisObj.#filterBy;
			if (column === -1) return;
			
			// Get filter keywords
			let keywords = $(this).val()?.trim().toLowerCase();
			
			$(thisObj.#table).find(`tbody tr`).filter(function() {
				// Get column keywords to match the keywords in
				let colValue = $($(this).find('td')[column]).text().trim().toLowerCase();
				$(this).toggle(colValue.includes(keywords));
			});
		});
	}
	
}