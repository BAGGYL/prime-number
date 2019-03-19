let message = {},
	primeNums = [],
	i, num,
	col = 0,
	timer = performance.now(),
	timeFrame = timer;

onmessage = function (e) {
	num = e.data.num;
	method = e.data.method;
	//Если метод расчета циклом
	if (method === 'chicle') {
		chicle();
		//Если метод расчета решетом
	} else if (method === 'sieve') {
		sieve();
	} else {
		console.error("Неизвестный метод");
		close();
	}
	pushFihish();
	close();
}

//Метод расчета циклом
function chicle() {
	primeNums.push(2); // 2 - единственное четное простое число
	//пробегаемся по всем числам
	loop:
		for (i = 3; i <= num; i += 2) {
			if (i > 10 && i % 10 === 5) {
				continue loop;
			}
			//пробегаемся по массиву простых чисел
			for (let j = 0; j < primeNums.length; j++) {
				//если поделилось нацело, это фиаско, выходим
				if (i % primeNums[j] === 0) {
					continue loop;
				} else if (primeNums[j] > Math.sqrt(i)) {
					primeNums.push(i);
					pushStatus();
					continue loop;
				}
			}
		}
	i--;
}

//Метод расчета решетом
function sieve() {
	let sieve = Array(num);

	primeNums.push(2); // 2 - единственное четное простое число
	// заполняем решето единицами
	for (i = 3; i <= num; i += 2) {
		sieve[i] = 1;
	}
	for (i = 3; i <= num; i += 2) {
		// если i - простое (не вычеркнуто)
		if (sieve[i] === 1) {
			primeNums.push(i);
			// то вычеркнем кратные 2*i
			for (let j = i * i; j <= num; j += 2 * i) {
				sieve[j] = 0;
			}
		}
		pushStatus();
	}
}

//Функция отправки промежуточных вычислений
function pushStatus() {
	if (performance.now() - timeFrame >= 1000 / 5) {
		message = {
			percent: (i / num * 100).toFixed(1) + "%",
			primeNums: "Ожидание....",
			length: primeNums.length,
			timer: (performance.now() - timer)
		};
		postMessage(message);
		timeFrame = performance.now()
	}
}

//Функция отправки результатов расчета
function pushFihish() {
	message = {
		percent: "100%",
		primeNums: primeNums.join(', '),
		length: primeNums.length,
		timer: (performance.now() - timer)
	};
	postMessage(message);
}